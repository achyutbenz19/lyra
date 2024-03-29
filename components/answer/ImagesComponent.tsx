import { ImagesComponentProps } from "@/lib/utils/types";
import Image from "next/image";
import { useState } from "react";

const ImagesComponent: React.FC<ImagesComponentProps> = ({ images }) => {
  const [showMore, setShowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const ImagesSkeleton = () => (
    <>
      {Array.from({ length: showMore ? 9 : 3 }).map((_, index) => (
        <div key={index} className="w-1/3 p-1">
          <div className="w-full overflow-hidden aspect-square">
            <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
      <div className="flex justify-left mt-4 w-full">
        <div
          className="bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse py-5 px-15 "
          style={{ height: "24px", width: "85px" }}
        ></div>
      </div>
    </>
  );

  const handleImageClick = (link: string) => {
    setSelectedImage(link);
  };

  const handleCloseModal = (event: React.MouseEvent<HTMLDivElement>) => {
    setSelectedImage(null);
  };

  return (
    <>
      <div
        className={`flex flex-wrap mx-1 transition-all duration-500 ${
          showMore ? "max-h-[500px]" : "max-h-[200px]"
        } overflow-hidden`}
      >
        {images.length === 0 ? (
          <ImagesSkeleton />
        ) : (
          images.slice(0, showMore ? 9 : 3).map((image, index) => (
            <div
              key={index}
              className="grid transition pt-2 ease-in-out hover:-translate-y-1 hover:scale-105 duration-200 w-1/3 p-1 cursor-pointer"
              onClick={() => handleImageClick(image.link)}
            >
              <div className="w-full overflow-hidden aspect-square">
                <img
                  src={image.link}
                  alt={image.alt || `Image ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))
        )}
      </div>
      {images.length > 3 && (
        <div className="flex mt-2">
          <button
            className="text-sm ml-1 px-1.5 font-semibold hover:bg-neutral-200 hover:dark:bg-neutral-800 py-1 border rounded-lg"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-lg overflow-auto"
          onClick={handleCloseModal}
        >
          <div className="flex justify-center items-center w-full h-full min-h-screen p-4">
            <div className="relative max-w-5xl mt-10 max-h-[80vh] bg-white rounded-lg shadow-xl overflow-auto">
              <img
                src={selectedImage}
                alt="Full size"
                className="max-w-full max-h-full object-contain"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagesComponent;
