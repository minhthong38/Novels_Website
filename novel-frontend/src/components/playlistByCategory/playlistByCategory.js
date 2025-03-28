import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { categories, novels } from '../../data/data';
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function PlaylistByCategory() {
  const { isDarkMode } = useContext(UserContext); // Get dark mode state from context
  const phrases = ['Hay Nhất', 'Nhiều View Nhất', 'Hấp Dẫn Nhất', 'Tiềm Năng Nhất'];

  const getRandomPhrase = () => {
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const getRandomNovelCover = (categoryId) => {
    const novelsInCategory = novels.filter(novel => novel.CategoryID === categoryId);
    if (novelsInCategory.length > 0) {
      const randomNovel = novelsInCategory[Math.floor(Math.random() * novelsInCategory.length)];
      return randomNovel.ImageUrl;
    }
    return 'https://via.placeholder.com/150'; // Fallback image if no novels in category
  };

  const topViewedNovel = novels.sort((a, b) => b.Views - a.Views)[0]; // Get the novel with the most views

  return (
    <div
      className={`ml-28 w-3/4 h-96 overflow-y-scroll border rounded-lg p-10 ${
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
              src={getRandomNovelCover(category.id)} 
              alt={`Cover for ${category.name}`} 
              className="w-16 mr-4 object-cover rounded"
            />
            <Link 
              to={`/menu/${category.id}`} 
              className={`text-lg font-semibold hover:underline ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}
            >
              Tuyển tập sách {category.name} {getRandomPhrase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
