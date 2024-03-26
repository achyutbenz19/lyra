import { UserMessageComponentProps } from "@/lib/utils/types";
import { CornerDownRight } from "lucide-react";
import Markdown from "react-markdown";

const UserMessageComponent: React.FC<UserMessageComponentProps> = ({
  message,
}) => {
  return (
    <div className="flex flex-row rounded-lg bg-neutral-200/50">
      <CornerDownRight className="h-6 w-8 mt-2.5 text-4xl pl-2" />
      <Markdown className=" dark:bg-neutral-800/60 w-full py-3 pl-2 pr-4">
        {message}
      </Markdown>
    </div>
  );
};

export default UserMessageComponent;
