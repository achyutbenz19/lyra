import { FollowUp } from "@/lib/utils/types";
import { Plus } from "lucide-react";

const FollowUpComponent = ({
  followUp,
  handleFollowUpClick,
}: {
  followUp: FollowUp;
  handleFollowUpClick: (question: string) => void;
}) => {
  const handleQuestionClick = (question: string) => {
    handleFollowUpClick(question);
  };

  return (
    <div className="border-t mt-3">
      <div className="md:mb-[150px] rounded-lg mt-4">
        <h2 className="text-lg font-semibold flex-grow">Related</h2>
        <ul className="mt-2">
          {followUp.choices[0].message.content &&
            JSON.parse(followUp.choices[0].message.content).followUp.map(
              (question: string, index: number) => (
                <li
                  key={index}
                  className="flex justify-between text-neutral-500 dark:hover:text-neutral-100 hover:text-neutral-700 dark:text-neutral-300 items-center mt-2 cursor-pointer"
                  onClick={() => handleQuestionClick(question)}
                >
                  <p className="hover:underline">{question}</p>
                  <Plus className="w-5 h-5 md:block hidden" />
                </li>
              ),
            )}
        </ul>
      </div>
    </div>
  );
};

export default FollowUpComponent;
