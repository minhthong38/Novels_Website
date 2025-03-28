import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { novels } from '../../data/data';
import { UserContext } from '../../context/UserContext';

export default function TopViewedNovels() {
  const { isDarkMode } = useContext(UserContext);

  const topViewedNovels = novels
    .sort((a, b) => b.Views - a.Views)
    .slice(0, 10); // Get the top 10 novels by views

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen p-8`}>
      <h1 className="text-2xl font-bold mb-6 text-center">Tuyển Tập Truyện Nhiều Views Nhất</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {topViewedNovels.map((novel) => (
          <div key={novel.NovelID} className="text-center">
            <Link to={`/novelDetail/${novel.NovelID}`}>
              <img 
                src={novel.ImageUrl} 
                alt={`Cover for ${novel.Title}`} 
                className="w-full h-48 object-cover rounded mb-2"
              />
              <p className="text-lg font-semibold">{novel.Title}</p>
              <p className="text-sm text-gray-500">{novel.Views} lượt xem</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
