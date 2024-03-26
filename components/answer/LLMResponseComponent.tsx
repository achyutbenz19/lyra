"use client";
interface LLMResponseComponentProps {
  llmResponse: string;
  currentLlmResponse: string;
  index: number;
}
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { useHover } from "usehooks-ts";

const StreamingComponent = ({
  currentLlmResponse,
}: {
  currentLlmResponse: string;
}) => {
  return (
    <>
      {currentLlmResponse && (
        <div className="bg-white shadow-lg rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold flex-grow">Answer</h2>
          </div>
          {currentLlmResponse}
        </div>
      )}
    </>
  );
};

const LLMResponseComponent = ({
  llmResponse,
  currentLlmResponse,
}: LLMResponseComponentProps) => {
  const hasLlmResponse = llmResponse && llmResponse.trim().length > 0;
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);
  const [copySuccess, setCopySuccess] = useState(false);
  const [icon, setIcon] = useState(
    <Copy className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />,
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  useEffect(() => {
    if (copySuccess) {
      setIcon(<Check className="h-4 w-4 text-green-600" />);
      setTimeout(
        () =>
          setIcon(
            <Copy className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />,
          ),
        2000,
      );
    }
  }, [copySuccess]);

  return (
    <>
      {hasLlmResponse ? (
        <div ref={hoverRef} className="flex flex-col">
          <div className="flex mt-3 flex-row space-x-2">
            <Markdown className="bg-neutral-200/70 dark:bg-neutral-700/50 w-full rounded-lg p-3 px-4">
              {llmResponse}
            </Markdown>
          </div>
          <div
            onClick={() => handleCopy(llmResponse)}
            className="duration-150 h-4 transition-all cursor-pointer mt-1 ml-1"
          >
            {isHover && icon}
          </div>
        </div>
      ) : (
        <StreamingComponent currentLlmResponse={currentLlmResponse} />
      )}
    </>
  );
};

export default LLMResponseComponent;
