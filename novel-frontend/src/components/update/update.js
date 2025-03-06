import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { novels } from '../../data/data';  
import { UserContext } from '../../context/UserContext'; 

export default function Update() {
  const [sortOrder, setSortOrder] = useState('earliest');
  const { isDarkMode } = useContext(UserContext); 

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Sort novels based on sortOrder
  const sortedNovels = [...novels].sort((a, b) => {
    if (sortOrder === 'earliest') {
      return new Date(a.Created_at) - new Date(b.Created_at);
    } else if (sortOrder === 'latest') {
      return new Date(b.Created_at) - new Date(a.Created_at);
    } else if (sortOrder === 'mostViews') {
      return b.Views - a.Views;
    }
  });

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Mới Cập Nhật</h2>
        <div className={`${isDarkMode ? 'bg-gray-900 text-black' : 'bg-white text-black'} min-h-screen`}>
        <div className="mb-10 text-center">
          <label htmlFor="sortOrder" className="mr-2 text-gray-400">Sắp xếp theo:</label>
          <select id="sortOrder" value={sortOrder} onChange={handleSortChange} className="border rounded px-2 py-1 ">
            <option value="earliest">Mới nhất</option>
            <option value="latest">Cũ nhất</option>
            <option value="mostViews">Truyện phổ biến</option>
          </select>
          
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
          {sortedNovels.map((novel) => (
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
      </div>
      </div>
    </div>
  );
}
