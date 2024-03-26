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
