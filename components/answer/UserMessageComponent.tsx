import { UserMessageComponentProps } from "@/lib/utils/types";
import { User } from "lucide-react";
import Markdown from "react-markdown";

const UserMessageComponent: React.FC<UserMessageComponentProps> = ({
  message,
}) => {
  return (
    <div className="flex flex-row space-x-2">
      <User className="rounded-full h-10 w-10 mt-1 bg-neutral-200/50 p-2 text-4xl" />
      <Markdown className="bg-neutral-200/50 dark:bg-neutral-800/60 w-full rounded-lg p-3 px-4">
        {message}
      </Markdown>
    </div>
  );
};

export default UserMessageComponent;
