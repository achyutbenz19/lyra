import { HeroQuestionProps } from "@/lib/utils/types";
import React from "react";

const HeroQuestion = ({ question, handleClick }: HeroQuestionProps) => {
  return (
    <div
      onClick={() => handleClick(question.question)}
      className="border drop-shadow-sm cursor-pointer hover:bg-neutral-200 hover:dark:bg-neutral-800 transition-all duration-150 text-md md:text-lg space-x-2 flex rounded-lg p-3"
    >
      <div>{question.emoji}</div>
      <div className="truncate">{question.question}</div>
    </div>
  );
};

export default HeroQuestion;
