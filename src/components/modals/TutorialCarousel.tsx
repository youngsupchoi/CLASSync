// components/TutorialCarousel.tsx
import { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Image1 from "../../assets/images/HomeCarouselImage1.png";
import Image2 from "../../assets/images/HomeCarouselImage2.png";
import Image3 from "../../assets/images/HomeCarouselImage3.png";
import Image4 from "../../assets/images/HomeCarouselImage4.png";

const images = [
  {
    src: Image1,
    alt: "Image 1",
    text: "Look at the top right corner at ChatGPT.",
  },
  { src: Image2, alt: "Image 2", text: "Click the share button" },
  { src: Image3, alt: "Image 3", text: "Create the share link" },
  { src: Image4, alt: "Image 4", text: "Copy and Paste it" },
];

export default function TutorialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex,
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between space-x-4 px-12">
        <div>
          {currentIndex > 0 ? (
            <button onClick={handlePrev}>
              <AiOutlineLeft size={24} />
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`inline-block h-2 w-2 rounded-full ${
                  index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                } mx-1`}
              ></span>
            ))}
          </div>
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="my-4 h-64 w-64 object-contain"
          />
          <p className="mt-2 text-center">{images[currentIndex].text}</p>
          {currentIndex === images.length - 1 && (
            <button
              className="mt-4 w-full rounded bg-[#4833CA] px-4 py-4 font-bold text-white"
              onClick={() => window.open("https://www.chatgpt.com", "_blank")}
            >
              Go to ChatGPT
            </button>
          )}
        </div>
        {currentIndex < images.length - 1 ? (
          <button onClick={handleNext}>
            <AiOutlineRight size={24} />
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>
    </div>
  );
}
