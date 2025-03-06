import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { novels } from '../../data/data';  // Adjust the import path as needed
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function Released() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDarkMode } = useContext(UserContext); // Get dark mode state from context

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Sort novels by release date in ascending order
  const sortedNovels = novels.sort((a, b) => new Date(a.Created_at) - new Date(b.Created_at));

  return (
    <div className="flex flex-col md:flex-row mb-10">
      <div className="flex-1 px-4">
        <h2 className={`text-xl font-bold mb-8 text-center md:text-left md:ml-32 ${isDarkMode ? 'text-white' : 'text-black'}`}>VỪA RA MẮT</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
          {sortedNovels.slice(currentIndex, currentIndex + 4).map((novel, index) => (
            <div key={novel.NovelID} className="text-center">
              <Link to={`/novelDetail/${novel.NovelID}`}>
                <img 
                  src={novel.ImageUrl} 
                  alt={`Book cover of ${novel.Title}`} 
                  className="mx-auto mb-2" 
                  style={{ width: '180px', height: '250px', objectFit: 'cover' }}
                />
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>{novel.Title}</p>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(sortedNovels.length / 4) }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${currentIndex === index * 4 ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => handleDotClick(index * 4)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
