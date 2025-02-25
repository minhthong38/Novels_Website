import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { novels } from '../../data/data';
// import UserStickyNote from '../UserStickyNote'; 

export default function History() {
  const navigate = useNavigate();
  const [readNovels, setReadNovels] = useState([]);

  useEffect(() => {
    const readNovelsData = novels.filter(novel => localStorage.getItem(`checkpoint_${novel.NovelID}`));
    setReadNovels(readNovelsData);
  }, []);

  const handleResumeReading = (novelID) => {
    const checkpoint = localStorage.getItem(`checkpoint_${novelID}`);
    navigate(`/novelView/${novelID}`, { state: { checkpoint: checkpoint ? JSON.parse(checkpoint) : null } });
  };

  const handleRestartReading = (novelID) => {
    localStorage.removeItem(`checkpoint_${novelID}`);
    navigate(`/novelView/${novelID}`, { state: { resetCheckpoint: true } });
  };

  return (
    <div className="flex justify-center items-start p-32">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="font-bold text-lg mb-4">LỊCH SỬ</h2>
            <div className="mb-2">
              <button className="flex items-center bg-gray-200 p-2 rounded-lg w-full">
                <i className="fas fa-eye mr-2"></i>
                <span>Sách đã đọc</span>
              </button>
            </div>
          </div>
          <div className="w-3/4 pl-4">
            <h2 className="font-bold text-lg mb-4">SÁCH ĐÃ ĐỌC</h2>
            {readNovels.map(novel => (
              <div key={novel.NovelID} className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center">
                <img src={novel.ImageUrl} alt={`Book cover of '${novel.Title}'`} className="w-24 h-36 rounded-lg mr-4"/>
                <div className="flex-1">
                  <h3 className="font-bold">{novel.Title}</h3>
                  <p>Phần 1</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => handleRestartReading(novel.NovelID)} 
                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <i className="fas fa-redo mr-2"></i>
                    <span>ĐỌC LẠI</span>
                  </button>
                  <button
                    onClick={() => handleResumeReading(novel.NovelID)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <i className="fas fa-play mr-2"></i>
                    <span>ĐỌC TIẾP</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <UserStickyNote /> */}
    </div>
  );
}
