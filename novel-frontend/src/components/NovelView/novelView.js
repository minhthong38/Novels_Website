import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { novels, novelContents } from '../../data/data';

export default function NovelView() {
  const { novelID } = useParams();
  const [novel, setNovel] = useState({});
  const [content, setContent] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [checkpoint, setCheckpoint] = useState(null);

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

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
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
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          onClick={handlePrevBanner}
        >
          &#8249;
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
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

      <div className="w-full sm:w-3/4 lg:w-2/3 m-4 sm:m-8 p-4 sm:p-8 mt-4 shadow-md rounded-md bg-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {novel.Title}
        </h2>
        {content.map((part, index) => (
          <div key={index}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {part.title}
            </h2>
            {part.content.map((paragraph, idx) => (
              <p 
                key={idx} 
                className={`text-gray-700 text-sm sm:text-base mt-4 cursor-pointer ${checkpoint === idx ? "bg-yellow-100" : ""}`}
                onClick={() => handleCheckpoint(idx)}
              >
                {paragraph}
                {checkpoint === idx && <span className="ml-2 text-blue-500">📌</span>}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
