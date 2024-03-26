import { ResultsProps } from "@/lib/utils/types";
import React from "react";
import SearchResultsComponent from "./answer/SearchResultsComponent";
import UserMessageComponent from "./answer/UserMessageComponent";
import LLMResponseComponent from "./answer/LLMResponseComponent";
import FollowUpComponent from "./answer/FollowUpComponent";
import VideosComponent from "./answer/VideosComponent";
import ImagesComponent from "./answer/ImagesComponent";

const Results = ({
  messages,
  currentLlmResponse,
  handleFollowUpClick,
}: ResultsProps) => {
  return (
    <div className="h-2">
      {messages.length > 0 && (
        <div className="flex flex-col h-10">
          {messages.map((message, index) => (
            <div key={`message-${index}`} className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/4 md:pr-2">
                {message.searchResults && (
                  <SearchResultsComponent
                    key={`searchResults-${index}`}
                    searchResults={message.searchResults}
                  />
                )}
                {message.type === "userMessage" && (
                  <UserMessageComponent message={message.userMessage} />
                )}
                <LLMResponseComponent
                  llmResponse={message.content}
                  currentLlmResponse={currentLlmResponse}
                  index={index}
                  key={`llm-response-${index}`}
                />
                {message.followUp && (
                  <div className="flex flex-col">
                    <FollowUpComponent
                      key={`followUp-${index}`}
                      followUp={message.followUp}
                      handleFollowUpClick={handleFollowUpClick}
                    />
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/4 lg:pl-2">
                {message.videos && (
                  <VideosComponent
                    key={`videos-${index}`}
                    videos={message.videos}
                  />
                )}
                {message.images && (
                  <ImagesComponent
                    key={`images-${index}`}
                    images={message.images}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
