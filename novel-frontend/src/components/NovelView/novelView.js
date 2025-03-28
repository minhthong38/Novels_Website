import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { novels, novelContents } from '../../data/data';
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function NovelView() {
  const { novelID } = useParams();
  const [novel, setNovel] = useState({});
  const [content, setContent] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [checkpoint, setCheckpoint] = useState(null);
  const { isDarkMode } = useContext(UserContext); // Get dark mode state from context
  const [currentPart, setCurrentPart] = useState(0);

  useEffect(() => {
    const selectedNovel = novels.find(novel => novel.NovelID === parseInt(novelID));
    setNovel(selectedNovel);
    setContent(novelContents[novelID]?.parts || []);
    setBanners(novelContents[novelID]?.banners || []);
    const savedCheckpoint = localStorage.getItem(`checkpoint_${novelID}`);
    if (savedCheckpoint) {
      setCheckpoint(JSON.parse(savedCheckpoint));
    }
  }, [novelID]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000); // 3000ms = 3s

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [banners.length]);

  const handleNextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const handlePrevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleCheckpoint = (index) => {
    if (checkpoint === index) {
      setCheckpoint(null);
      localStorage.removeItem(`checkpoint_${novelID}`);
    } else {
      setCheckpoint(index);
      localStorage.setItem(`checkpoint_${novelID}`, JSON.stringify(index));
    }
  };

  const handleNextPart = () => {
    setCurrentPart((prev) => (prev + 1) % content.length);
  };

  const handlePrevPart = () => {
    setCurrentPart((prev) => (prev - 1 + content.length) % content.length);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col items-center`}>
      <div className="relative w-full h-[500px] overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url(${banners[currentBanner]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <button
          className={`absolute top-1/2 left-4 transform -translate-y-1/2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} p-2 rounded-full`}
          onClick={handlePrevBanner}
        >
          &#8249;
        </button>
        <button
          className={`absolute top-1/2 right-4 transform -translate-y-1/2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} p-2 rounded-full`}
          onClick={handleNextBanner}
        >
          &#8250;
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentBanner ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>

      <div className={`w-full sm:w-3/4 lg:w-2/3 m-4 sm:m-8 p-4 sm:p-8 mt-4 shadow-md rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {novel.Title}
        </h2>
        {content[currentPart]?.content.map((paragraph, idx) => (
          <p 
            key={idx} 
            className={`text-sm sm:text-base mt-4 cursor-pointer ${isDarkMode ? 'text-white' : 'text-black'} ${checkpoint === idx ? "bg-gray-200 dark:bg-gray-400" : ""}`}
            onClick={() => handleCheckpoint(idx)}
          >
            {paragraph}
            {checkpoint === idx && <span className="ml-2 text-blue-500">📌</span>}
          </p>
        ))}
        <div className="mt-4 flex justify-between items-center">
          <button
            className={`mr-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} p-2 rounded-full`}
            onClick={handlePrevPart}
          >
            Previous Part
          </button>
          <span className="text-lg">{currentPart + 1} / {content.length}</span>
          <button
            className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} p-2 rounded-full`}
            onClick={handleNextPart}
          >
            Next Part
          </button>
        </div>
      </div>
    </div>
  );
}
