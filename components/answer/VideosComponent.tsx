import { VideosComponentProps } from "@/lib/utils/types";
import { Video } from "lucide-react";
import { useState, useEffect } from "react";

const VideosComponent: React.FC<VideosComponentProps> = ({ videos }) => {
  const [showMore, setShowMore] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setLoadedImages(Array(videos.length).fill(false));
  }, [videos]);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prevLoadedImages) => {
      const updatedLoadedImages = [...prevLoadedImages];
      updatedLoadedImages[index] = true;
      return updatedLoadedImages;
    });
  };

  const handleVideoClick = (link: string) => {
    setSelectedVideo(link);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setIsFullScreen(false);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const VideosSkeleton = () => (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="w-1/3 p-1">
          <div className="w-full overflow-hidden aspect-video">
            <div className="w-full h-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
      <div className="flex justify-left mt-4 w-full">
        <div
          className="bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse py-5 px-15"
          style={{ height: "24px", width: "85px" }}
        ></div>
      </div>
    </>
  );

  return (
    <>
      <div
        className={`flex md:mx-0 flex-wrap border-t mt-3 md:mb-0 w-full transition-all duration-500 ${
          showMore ? "max-h-[500px]" : "max-h-[200px]"
        } overflow-hidden`}
      >
        {videos.length === 0 ? (
          <VideosSkeleton />
        ) : (
          videos.slice(0, showMore ? 9 : 3).map((video, index) => (
            <div
              key={index}
              className="transition mt-1 ease-in-out p-2 duration-200 transform hover:-translate-y-1 hover:scale-105 w-1/3 cursor-pointer"
              onClick={() => handleVideoClick(video.link)}
            >
              {!loadedImages[index] && (
                <div className="w-full overflow-hidden aspect-video">
                  <div className="w-full h-24 bg-neutral-200  rounded animate-pulse"></div>
                </div>
              )}
              <div className="w-full overflow-hidden aspect-video transition-all duration-200">
                <img
                  src={video.imageUrl}
                  alt={`Video ${index}`}
                  className={`w-full h-auto rounded-lg transition-all duration-200 ${
                    loadedImages[index] ? "block" : "hidden"
                  }`}
                  onLoad={() => handleImageLoad(index)}
                />
                <div className="absolute bg-black p-1 rounded-lg flex flex-row space-x-2 bottom-2 right-2">
                  <Video className="text-white rounded-lg h-4 w-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {videos.length > 3 && (
        <div className="flex mt-2 mb-[150px]">
          <button
            className="text-sm ml-1 px-1.5 font-semibold hover:bg-neutral-200 hover:dark:bg-neutral-800 py-1 border rounded-lg"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
      {selectedVideo && (
        <div
          className={`fixed ${
            isFullScreen ? "inset-0" : "bottom-2 right-2 md:bottom-2 md:right-2"
          } z-50 ${
            isFullScreen
              ? "w-full h-full"
              : "w-full md:w-1/2 lg:w-1/4 h-1/4 md:h-1/4"
          } bg-black bg-opacity-75 flex items-center justify-center transition-all duration-300 rounded-lg shadow-lg border-4 border-white`}
        >
          <div className="relative w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                selectedVideo,
              )}?autoplay=1`}
              title="YouTube Video"
              allowFullScreen
              className="w-full h-full rounded-lg"
              allow="autoplay"
            ></iframe>
            <button
              className="absolute top-2 right-2 p-2 bg-white text-black rounded-full hover:bg-neutral-200  focus:outline-none"
              onClick={handleCloseModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <button
              className="absolute bottom-2 right-2 p-2 bg-white text-black rounded-full hover:bg-neutral-200  focus:outline-none"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 3h5m0 0v5m0-5l-7 7M9 21H4m0 0v-5m0 5l7-7m5 7v5m0-5h5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const getYouTubeVideoId = (url: string) => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?(?:\S+)/,
  );
  return match ? match[0].split("/").pop()?.split("=").pop() : "";
};

export default VideosComponent;
