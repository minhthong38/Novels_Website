import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchNovelsByCategory, fetchCategoryDetails } from '../../services/apiService';
import { UserContext } from '../../context/UserContext';

export default function PlaylistPage() {
  const { categoryID } = useParams();
  const { isDarkMode } = useContext(UserContext);
  const [novels, setNovels] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryDetails = await fetchCategoryDetails(categoryID);
        setCategoryName(categoryDetails.titleCategory);

        const novelsData = await fetchNovelsByCategory(categoryID);
        setNovels(novelsData.sort((a, b) => b.views - a.views)); // Sort by views
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [categoryID]);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="max-w-4xl mx-auto p-9">
        <h1 className="text-center text-3xl font-bold mb-6 mt-10">
          Tuyển tập sách {categoryName || 'Danh mục không xác định'}
        </h1>
        <div className="grid grid-cols-2 gap-6 mb-10">
          {novels.map((novel) => (
            <div key={novel._id} className="text-center flex flex-col items-center">
              <Link to={`/novelDetail/${novel._id}`}>
                <img
                  src={novel.imageUrl}
                  alt={novel.title}
                  className="mb-4 object-cover"
                  style={{ width: '180px', height: '250px' }}
                />
                <p className={`text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>{novel.title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
