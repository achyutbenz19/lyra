import "server-only";
import { createAI, createStreamableValue } from "ai/rsc";
import { OpenAI } from "openai";
import cheerio from "cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document as DocumentInterface } from "langchain/document";

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  favicon: string;
}

interface ContentResult extends SearchResult {
  html: string;
}

async function getSources(message: string) {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
        message,
      )}&count=10`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY as string,
        },
      },
    );
    if (!response.ok) throw Error(`HTTP Error!, ${response.status}`);

    const jsonResponse = await response.json();
    if (!jsonResponse) throw Error("Invalid API response format");

    const final = jsonResponse.web.results.map(
      (result: any): SearchResult => ({
        title: result.title,
        link: result.url,
        snippet: result.description,
        favicon: result.profile.img,
      }),
    );
    return final;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
}

async function get10BlueLinksContents(
  sources: SearchResult[],
): Promise<ContentResult[]> {
  async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 800,
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (error) {
        console.log(`Skipping ${url}!`);
      }
      throw error;
    }
  }
  function extractMainContent(html: string): string {
    try {
      const $ = cheerio.load(html);
      $("script, style, head, nav, footer, iframe, img").remove();
      return $("body").text().replace(/\s+/g, " ").trim();
    } catch (error) {
      console.error("Error extracting main content:", error);
      throw error;
    }
  }
  const promises = sources.map(
    async (source): Promise<ContentResult | null> => {
      try {
        const response = await fetchWithTimeout(source.link, {}, 800);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${source.link}. Status: ${response.status}`,
          );
        }
        const html = await response.text();
        const mainContent = extractMainContent(html);
        return { ...source, html: mainContent };
      } catch (error) {
        console.error(`Error processing ${source.link}:`, error);
        return null;
      }
    },
  );
  try {
    const results = await Promise.all(promises);
    return results.filter((source): source is ContentResult => source !== null);
  } catch (error) {
    console.error("Error fetching and processing blue links contents:", error);
    throw error;
  }
}

async function processAndVectorizeContent(
  contents: ContentResult[],
  query: string,
  textChunkSize = 1000,
  textChunkOverlap = 400,
  numberOfSimilarityResults = 4,
): Promise<DocumentInterface[]> {
  try {
    const embeddings = new OpenAIEmbeddings();
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      if (content.html.length > 0) {
        try {
          const splitText = await new RecursiveCharacterTextSplitter({
            chunkSize: textChunkSize,
            chunkOverlap: textChunkOverlap,
          }).splitText(content.html);
          const vectorStore = await MemoryVectorStore.fromTexts(
            splitText,
            { title: content.title, link: content.link },
            embeddings,
          );
          return await vectorStore.similaritySearch(
            query,
            numberOfSimilarityResults,
          );
        } catch (error) {
          console.error(`Error processing content for ${content.link}:`, error);
        }
      }
    }
    return [];
  } catch (error) {
    console.error("Error processing and vectorizing content:", error);
    throw error;
  }
}

async function getImages(
  message: string,
): Promise<{ title: string; link: string }[]> {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/images/search?q=${message}&spellcheck=1`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY as string,
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        `Network response was not ok. Status: ${response.status}`,
      );
    }
    const data = await response.json();
    const validLinks = await Promise.all(
      data.results.map(async (result: any) => {
        const link = result.properties.url;
        if (typeof link === "string") {
          try {
            const imageResponse = await fetch(link, { method: "HEAD" });
            if (imageResponse.ok) {
              const contentType = imageResponse.headers.get("content-type");
              if (contentType && contentType.startsWith("image/")) {
                return {
                  title: result.properties.title,
                  link: link,
                };
              }
            }
          } catch (error) {
            console.error(`Error fetching image link ${link}:`, error);
          }
        }
        return null;
      }),
    );
    const filteredLinks = validLinks.filter(
      (link): link is { title: string; link: string } => link !== null,
    );
    return filteredLinks.slice(0, 9);
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
    throw error;
  }
}

async function getVideos(
  message: string,
): Promise<{ imageUrl: string; link: string }[] | null> {
  const url = "https://google.serper.dev/videos";
  const data = JSON.stringify({
    q: message,
  });
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API as string,
      "Content-Type": "application/json",
    },
    body: data,
  };
  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(
        `Network response was not ok. Status: ${response.status}`,
      );
    }
    const responseData = await response.json();
    const validLinks = await Promise.all(
      responseData.videos.map(async (video: any) => {
        const imageUrl = video.imageUrl;
        if (typeof imageUrl === "string") {
          try {
            const imageResponse = await fetch(imageUrl, { method: "HEAD" });
            if (imageResponse.ok) {
              const contentType = imageResponse.headers.get("content-type");
              if (contentType && contentType.startsWith("image/")) {
                return { imageUrl, link: video.link };
              }
            }
          } catch (error) {
            console.error(`Error fetching image link ${imageUrl}:`, error);
          }
        }
        return null;
      }),
    );
    const filteredLinks = validLinks.filter(
      (link): link is { imageUrl: string; link: string } => link !== null,
    );
    return filteredLinks.slice(0, 9);
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}

const relevantQuestions = async (sources: SearchResult[]): Promise<any> => {
  return await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are a Question generate who generates in JSON an array of 3 follow up questions.
           The JSON schema should include {
            "followUp": [
              "Question 1",
              "Question 2", 
              "Question 3"
            ]
           }
          `,
      },
      {
        role: "user",
        content: ` - Here are the top results from a similarity search: ${JSON.stringify(
          sources,
        )}. `,
      },
    ],
    model: "mixtral-8x7b-32768",
    response_format: { type: "json_object" },
  });
};

async function myAction(message: string): Promise<any> {
  "use server";
  const userMessage = message.replace("LLM", "Large Language Models")
  const streamable = createStreamableValue({});
  (async () => {
    const [images, sources, videos] = await Promise.all([
      getImages(userMessage),
      getSources(userMessage),
      getVideos(userMessage),
    ]);
    streamable.update({ searchResults: sources });
    streamable.update({ images: images });
    streamable.update({ videos: videos });
    const html = await get10BlueLinksContents(sources);
    const vectorResults = await processAndVectorizeContent(html, userMessage);
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
            - When you submit a query specified as ${userMessage}, my response will be crafted to provide a comprehensive and technical explanation, formatted in markdown. The focus will be on delivering detailed, technical content, drawing from a wide range of sources to ensure accuracy and depth. For instance, if your question pertains to a complex subject within technology, science, programming, or any specialized field, I will delve into the specifics, terminology, methodologies, and frameworks relevant to your query. for example, an LLM means a Large Language Model. Answer technically
              Should your question align with areas where real-time data or recent developments are essential. However, in cases where the information is not available or the query does not yield relevant results, I will clearly state, "No relevant results found.`,
        },
        {
          role: "user",
          content: ` - Here are the top results from a similarity search: ${JSON.stringify(
            vectorResults,
          )}. `,
        },
      ],
      stream: true,
      model: "mixtral-8x7b-32768",
    });
    for await (const chunk of chatCompletion) {
      if (chunk.choices[0].delta && chunk.choices[0].finish_reason !== "stop") {
        streamable.update({ llmResponse: chunk.choices[0].delta.content });
      } else if (chunk.choices[0].finish_reason === "stop") {
        streamable.update({ llmResponseEnd: true });
      }
    }
    const followUp = await relevantQuestions(sources);
    streamable.update({ followUp: followUp });
    streamable.done({ status: "done" });
  })();
  return streamable.value;
}

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    myAction,
  },
  initialUIState,
  initialAIState,
});
