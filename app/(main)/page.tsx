"use client";
import ChatInput from "@/components/chat-input";
import Header from "@/components/header";
import { readStreamableValue, useActions } from "ai/rsc";
import React, { useCallback, useState } from "react";
import { AI } from "../api/actions";
import { Message, SearchResult, StreamMessage } from "@/lib/utils/types";
import Results from "@/components/results";
import { messageConstant } from "@/message";

const Chat = () => {
  const { myAction } = useActions<typeof AI>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentLlmResponse, setCurrentLlmResponse] = useState("");

  const handleFollowUpClick = useCallback(async (question: string) => {
    setCurrentLlmResponse("");
    // await handleUserMessageSubmission(question);
  }, []);

  const handleUserMessageSubmission = async (
    userMessage: string,
  ): Promise<void> => {
    const newMessageId = Date.now();
    const newMessage = {
      id: newMessageId,
      type: "userMessage",
      userMessage: userMessage,
      content: "",
      images: [],
      videos: [],
      followUp: null,
      isStreaming: true,
      searchResults: [] as SearchResult[],
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    let lastAppendedResponse = "";
    try {
      const streamableValue = await myAction(userMessage);
      let llmResponseString = "";
      for await (const message of readStreamableValue(streamableValue)) {
        const typedMessage = message as StreamMessage;
        setMessages((prevMessages) => {
          const messagesCopy = [...prevMessages];
          const messageIndex = messagesCopy.findIndex(
            (msg) => msg.id === newMessageId,
          );
          if (messageIndex !== -1) {
            const currentMessage = messagesCopy[messageIndex];
            if (
              typedMessage.llmResponse &&
              typedMessage.llmResponse !== lastAppendedResponse
            ) {
              currentMessage.content += typedMessage.llmResponse;
              lastAppendedResponse = typedMessage.llmResponse;
            }
            if (typedMessage.llmResponseEnd) {
              currentMessage.isStreaming = false;
            }
            if (typedMessage.searchResults) {
              currentMessage.searchResults = typedMessage.searchResults;
            }
            if (typedMessage.images) {
              currentMessage.images = [...typedMessage.images];
            }
            if (typedMessage.videos) {
              currentMessage.videos = [...typedMessage.videos];
            }
            if (typedMessage.followUp) {
              currentMessage.followUp = typedMessage.followUp;
            }
          }
          return messagesCopy;
        });
        if (typedMessage.llmResponse) {
          llmResponseString += typedMessage.llmResponse;
          setCurrentLlmResponse(llmResponseString);
        }
      }
    } catch (error) {
      console.error("Error streaming data for user message:", error);
    }
  };

  const handleSubmit = async (input: string) => {
    if (!input) return;
    // await handleUserMessageSubmission(input);
    setMessages(messageConstant)
  };

  return (
    <main>
      <Header />
      <Results
        currentLlmResponse={currentLlmResponse}
        messages={messages}
        handleFollowUpClick={handleFollowUpClick}
      />
      <ChatInput handleSubmit={handleSubmit} />
    </main>
  );
};

export default Chat;
