import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { SearchResult } from "@/lib/utils/types";

const SearchResultsComponent = ({
  searchResults,
}: {
  searchResults: SearchResult[];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpansion = () => setIsExpanded(!isExpanded);
  const visibleResults = isExpanded ? searchResults : searchResults.slice(0, 3);

  return (
    <div className="flex flex-col mt-3 my-2">
      <h2 className="text-lg font-semibold flex-grow">Sources</h2>
      {searchResults.length === 0 ? (
        <div className="flex mt-2 flex-wrap">
          {Array.from({ length: isExpanded ? searchResults.length : 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="mr-2 p-1 border-2 px-1.5 max-w-lg text-sm bg-neutral-200 dark:bg-neutral-800 rounded-lg"
              >
                <div className="flex items-center space-x-2 px-3 rounded-lg">
                  <div className="w-6 h-3 rounded animate-pulse" />
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <TooltipProvider>
          <div className="space-y-2 mt-3">
            {visibleResults.map((result, index) => (
              <Tooltip key={index}>
                <TooltipTrigger className="flex lg:space-x-0 space-x-2 flex-row border mr-2 p-1 px-1.5 max-w-lg text-sm truncate hover:bg-neutral-200 hover:dark:bg-neutral-800 rounded-lg">
                  <Image
                    src={result.favicon}
                    className="h-5 w-5 lg:hidden"
                    height={20}
                    width={20}
                    alt={result.favicon}
                  />
                  <Link href={result.link}>{result.title}</Link>
                </TooltipTrigger>
                <TooltipContent sideOffset={15}>
                  <Card>
                    <CardContent className="space-x-2 flex">
                      <Image
                        src={result.favicon}
                        className="h-5 w-5"
                        height={20}
                        width={20}
                        alt={result.favicon}
                      />
                      <span>{result.link}</span>
                    </CardContent>
                  </Card>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      )}
      {searchResults.length !== 0 && (
        <div
          onClick={toggleExpansion}
          className="border cursor-pointer mr-2 mt-2 p-1 w-fit text-sm truncate hover:bg-neutral-200 hover:dark:bg-neutral-800 rounded-lg"
        >
          {!isExpanded ? (
            <span className="text-xs font-semibold">View more</span>
          ) : (
            <span className="text-sm font-semibold">Show Less</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsComponent;
