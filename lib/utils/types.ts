export interface SearchResult {
  favicon: string;
  link: string;
  title: string;
}
export interface Message {
  id: number;
  type: string;
  content: string;
  userMessage: string;
  images: Image[];
  videos: Video[];
  followUp: FollowUp | null;
  isStreaming: boolean;
  searchResults?: SearchResult[];
}
export interface StreamMessage {
  searchResults?: any;
  userMessage?: string;
  llmResponse?: string;
  llmResponseEnd?: boolean;
  images?: any;
  videos?: any;
  followUp?: any;
}
export interface Image {
  link: string;
}
export interface Video {
  link: string;
  imageUrl: string;
}
export interface FollowUp {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface ChatInputProps {
  handleSubmit: (message: string) => void;
}

export interface ResultsProps {
  messages: Message[];
  currentLlmResponse: string;
  handleFollowUpClick: (question: string) => void;
}

export interface UserMessageComponentProps {
  message: string;
}

export interface SearchResult {
  favicon: string;
  link: string;
  title: string;
}

export interface SearchResultsComponentProps {
  searchResults: SearchResult[];
}

export interface FollowUp {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface LLMResponseComponentProps {
  llmResponse: string;
  currentLlmResponse: string;
  index: number;
}

export interface Image {
  link: string;
  alt?: string;
}

export interface ImagesComponentProps {
  images: Image[];
}

export interface Video {
  link: string;
  imageUrl: string;
}

export interface VideosComponentProps {
  videos: Video[];
}

export interface HeroProps {
  messages: Message[];
  handleClick: (question: string) => void;
}

export interface HeroQuestionProps {
  question: {
    question: string;
    emoji: string;
  };
  handleClick: (question: string) => void;
}
