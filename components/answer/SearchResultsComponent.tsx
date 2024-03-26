import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Card,
  CardContent,
} from "../ui/card";
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

  const SearchResultsSkeleton = () => (
    <>
      {Array.from({ length: isExpanded ? searchResults.length : 3 }).map(
        (_, index) => (
          <div key={index} className="p-2 w-full sm:w-1/2 md:w-1/4">
            <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg h-full">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ),
      )}
    </>
  );

  return (
    <div className="flex flex-wrap my-2">
      {searchResults.length === 0 ? (
        <SearchResultsSkeleton />
      ) : (
        <TooltipProvider>
          <div className="space-y-2">
            {visibleResults.map((result, index) => (
              <Tooltip key={index}>
                <TooltipTrigger className="border mr-2 p-1 max-w-lg text-sm truncate hover:bg-neutral-200 hover:dark:bg-neutral-800 rounded-lg">
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
      <div
        onClick={toggleExpansion}
        className="border cursor-pointer mr-2 mt-2 p-1 max-w-lg text-sm truncate hover:bg-neutral-200 hover:dark:bg-neutral-800 rounded-lg"
      >
        {!isExpanded ? (
          <span className="text-xs font-semibold">View more</span>
        ) : (
          <span className="text-sm font-semibold">Show Less</span>
        )}
      </div>
    </div>
  );
};

export default SearchResultsComponent;
