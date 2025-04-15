import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchNovelsByCategory, fetchCategoryDetails } from '../../services/apiService'; // Import API functions
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function Menu() {
  const { categoryID } = useParams();
  const { isDarkMode } = useContext(UserContext); // Get dark mode state from context
  const [novels, setNovels] = useState([]); // State for novels
  const [categoryName, setCategoryName] = useState(''); // State for category name

  useEffect(() => {
    // Fetch novels for the selected category
    fetchNovelsByCategory(categoryID)
      .then((data) => {
        if (Array.isArray(data)) {
          setNovels(data); // Set novels for the category
        } else {
          setNovels([]); // Handle unexpected data format
        }
      })
      .catch((error) => {
        console.error('Error fetching novels:', error);
        setNovels([]); // Handle errors
      });

    // Fetch category details to get the category name
    fetchCategoryDetails(categoryID)
      .then((data) => {
        if (data && data.titleCategory) {
          setCategoryName(data.titleCategory); // Set the category name
        } else {
          setCategoryName('Unknown Category'); // Handle unexpected data format
        }
      })
      .catch((error) => {
        console.error('Error fetching category details:', error);
        setCategoryName('Unknown Category'); // Handle errors
      });
  }, [categoryID]); // Re-run when categoryID changes

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="max-w-4xl mx-auto p-9">
        <h1 className="text-center text-3xl font-bold mb-6 mt-10">{categoryName}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {novels.map((novel) => (
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
