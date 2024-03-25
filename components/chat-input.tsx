"use client";
import { ChatInputProps } from "@/lib/utils/types";
import { FormEvent, useState } from "react";
import { Input } from "./ui/input";

const ChatInput = ({ handleSubmit }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSubmit(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex items-center justify-center"
    >
      <Input
        className="fixed md:w-[60%] h-12 w-[90%] border-neutral-500 bottom-0 rounded-lg mb-6 md:mb-8 shadow-xl p-2 min-h-[60px] resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none"
        placeholder="Send a message."
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </form>
  );
};

export default ChatInput;
