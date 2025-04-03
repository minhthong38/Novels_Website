import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories, novels } from '../../data/data';
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function PlaylistByCategory() {
  const { isDarkMode } = useContext(UserContext); // Get dark mode state from context
  const [randomPhrases, setRandomPhrases] = useState({}); // State to store random phrases for each category
  const [categoryImages, setCategoryImages] = useState({}); // State to store the images for each category

  const phrases = ['Hay Nhất', 'Xuất Sắc', 'Hấp Dẫn', 'Tiềm Năng', 'Đáng Đọc', 'Thú Vị', 'Kinh Điển', 'Mới Nhất', 'Hot Nhất'];

  // Generate random phrase and image for each category when component mounts
  useEffect(() => {
    const phrasesForCategories = categories.reduce((acc, category) => {
      const random = phrases[Math.floor(Math.random() * phrases.length)];
      acc[category.id] = random; // Store random phrase for each category
      return acc;
    }, {});

    const imagesForCategories = categories.reduce((acc, category) => {
      const novelsInCategory = novels.filter(novel => novel.CategoryID === category.id);
      if (novelsInCategory.length > 0) {
        const randomNovel = novelsInCategory[Math.floor(Math.random() * novelsInCategory.length)];
        acc[category.id] = randomNovel.ImageUrl;
      } else {
        acc[category.id] = 'https://via.placeholder.com/150'; // Fallback image if no novels in category
      }
      return acc;
    }, {});

    setRandomPhrases(phrasesForCategories);
    setCategoryImages(imagesForCategories);
  }, [categories, novels]); // Run this effect only when categories or novels change

  const topViewedNovel = novels.sort((a, b) => b.Views - a.Views)[0]; // Get the novel with the most views

  return (
    <div
      className={`ml-28 w-3/4 h-[500px] mt-20 overflow-y-scroll border rounded-lg p-10 ${
        isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
      }`}
    >
      <h2 className="text-xl font-bold mb-4">PLAYLIST</h2>

      {/* Tuyển tập truyện nhiều views nhất */}
      <div className="mb-8 flex items-center">
        <img 
          src={topViewedNovel.ImageUrl} 
          alt={`Cover for ${topViewedNovel.Title}`} 
          className="w-16 h-20 mr-4 object-cover rounded"
        />
        <Link 
          to="/topViewedNovels" // Navigate to the new page
          className={`text-lg font-semibold hover:underline ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          Tuyển tập truyện nhiều views nhất
        </Link>
      </div>

      {/* Tuyển tập theo thể loại */}
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category.id} className="border-b pb-2 flex items-center">
            <img 
              src={categoryImages[category.id]} // Use pre-calculated image from state
              alt={`Cover for ${category.name}`} 
              className="w-16 mr-4 object-cover rounded"
            />
            <Link 
              to={`/menu/${category.id}`} 
              className={`text-lg font-semibold hover:underline ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}
            >
              Tuyển tập sách {category.name} {randomPhrases[category.id] || 'Mới Nhất'} {/* Displaying the random phrase per category */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
