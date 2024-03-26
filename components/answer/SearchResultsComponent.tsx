// 1. Import the 'useState' and 'useEffect' hooks from React
import { useState, useEffect } from "react";

// 2. Define the 'SearchResult' interface with properties for 'favicon', 'link', and 'title'
export interface SearchResult {
  favicon: string;
  link: string;
  title: string;
}

// 3. Define the 'SearchResultsComponentProps' interface with a 'searchResults' property of type 'SearchResult[]'
export interface SearchResultsComponentProps {
  searchResults: SearchResult[];
}

// 4. Define the 'SearchResultsComponent' functional component that takes 'searchResults' as a prop
const SearchResultsComponent = ({
  searchResults,
}: {
  searchResults: SearchResult[];
}) => {
  // 5. Use the 'useState' hook to manage the 'isExpanded' and 'loadedFavicons' state
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedFavicons, setLoadedFavicons] = useState<boolean[]>([]);

  // 6. Use the 'useEffect' hook to initialize the 'loadedFavicons' state based on the 'searchResults' length
  useEffect(() => {
    setLoadedFavicons(Array(searchResults.length).fill(false));
  }, [searchResults]);

  // 7. Define the 'toggleExpansion' function to toggle the 'isExpanded' state
  const toggleExpansion = () => setIsExpanded(!isExpanded);

  // 8. Define the 'visibleResults' variable to hold the search results to be displayed based on the 'isExpanded' state
  const visibleResults = isExpanded ? searchResults : searchResults.slice(0, 3);

  // 9. Define the 'handleFaviconLoad' function to update the 'loadedFavicons' state when a favicon is loaded
  const handleFaviconLoad = (index: number) => {
    setLoadedFavicons((prevLoadedFavicons) => {
      const updatedLoadedFavicons = [...prevLoadedFavicons];
      updatedLoadedFavicons[index] = true;
      return updatedLoadedFavicons;
    });
  };

  // 10. Define the 'SearchResultsSkeleton' component to render a loading skeleton
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

  // 11. Render the 'SearchResultsComponent'
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mt-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold flex-grow">Sources</h2>
        <img src="./brave.png" alt="brave logo" className="w-6 h-6" />
      </div>
      <div className="flex flex-wrap my-2">
        {searchResults.length === 0 ? (
          // 12. Render the 'SearchResultsSkeleton' if there are no search results
          <SearchResultsSkeleton />
        ) : (
          // 13. Render the search results with favicon, title, and link
          visibleResults.map((result, index) => (
            <div key={index} className="p-2 w-full sm:w-1/2 md:w-1/4">
              <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg h-full">
                {!loadedFavicons[index] && (
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                )}
                <img
                  src={result.favicon}
                  alt="favicon"
                  className={`w-5 h-5 ${
                    loadedFavicons[index] ? "block" : "hidden"
                  }`}
                  onLoad={() => handleFaviconLoad(index)}
                />
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold truncate"
                >
                  {result.title}
                </a>
              </div>
            </div>
          ))
        )}
        {/* 14. Render a button to toggle the expansion of search results */}
        <div className="w-full sm:w-full md:w-1/4 p-2">
          <div
            onClick={toggleExpansion}
            className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg cursor-pointer h-12 justify-center"
          >
            {!isExpanded ? (
              <>
                {searchResults.slice(3).map((result, index) => (
                  <img
                    key={index}
                    src={result.favicon}
                    alt="favicon"
                    className="w-4 h-4"
                  />
                ))}
                <span className="text-xs font-semibold">View more</span>
              </>
            ) : (
              <span className="text-sm font-semibold">Show Less</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsComponent;
