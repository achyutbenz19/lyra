import { HeroProps } from "@/lib/utils/types";
import React from "react";
import HeroQuestion from "./hero-question";
import { questions } from "@/lib/utils/questions";

const Hero = ({ messages, handleClick }: HeroProps) => {
  return (
    <>
      {messages.length === 0 && (
        <div className="fle flex-col w-full text-center mt-20 lg:mt-32 justify-center">
          <h1 className="text-5xl lg:text-6xl font-semibold ease-in-out">
            Where curiosity begins
          </h1>
          <p className="mt-4 md:mt-8">
            looking for ideas?{" "}
            <span className="underline">explore these topics</span>.
          </p>
          <div className="flex mt-8 md:mt-16 md:px-16 px-10 items-center justify-center">
            <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid mx-auto gap-4 items-center justify-center rounded-lg">
              {questions.map((question, index) => (
                <HeroQuestion
                  handleClick={handleClick}
                  key={index}
                  question={question}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
