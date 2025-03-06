import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categories, novels } from '../../data/data';  // Adjust the import path as needed
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function Menu() {
  const { categoryID } = useParams();
  const { isDarkMode } = useContext(UserContext); // Get dark mode state from context

  const filteredNovels = novels.filter(novel => novel.CategoryID === parseInt(categoryID));
  const categoryName = categories.find(category => category.id === parseInt(categoryID))?.name;

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="max-w-4xl mx-auto p-9">
        <h1 className="text-center text-3xl font-bold mb-6 mt-10">{categoryName}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {filteredNovels.map(novel => (
            <div key={novel.NovelID} className="text-center">
              <Link to={`/novelDetail/${novel.NovelID}`}>
                <img src={novel.ImageUrl} alt={novel.Title} className="mb-4" style={{ width: '180px', height: '250px' }} />
                <p className={`text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>{novel.Title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
