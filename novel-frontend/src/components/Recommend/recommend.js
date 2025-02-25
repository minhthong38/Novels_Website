import React from 'react';
import { Link } from 'react-router-dom';
import { novels } from '../../data/data';  // Adjust the import path as needed

export default function Recommend() {
  // Sort novels by views in descending order and take the top 6
  const topNovels = novels.sort((a, b) => b.Views - a.Views).slice(0, 6);

  return (
    <div className="flex flex-col items-center md:flex-row md:justify-center md:ml-36 mb-10">
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4 text-center md:text-left md:ml-5">SÁCH ĐỀ XUẤT</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
          {topNovels.map((novel) => (
            <div key={novel.NovelID} className="text-center">
              <Link to={`/novelDetail/${novel.NovelID}`}>
                <img src={novel.ImageUrl} style={{ width: '180px', height: '250px' }} alt={`Book cover of ${novel.Title}`} className="mx-auto mb-2"/>
                <p className="text-sm">{novel.Title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
