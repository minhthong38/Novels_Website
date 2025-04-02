import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { novels } from '../../data/data';
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function History() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(UserContext); // Get dark mode state from context
  const [readNovels, setReadNovels] = useState([]);

  useEffect(() => {
    const readNovelsData = novels.filter(novel => localStorage.getItem(`checkpoint_${novel.NovelID}`) !== null);
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

  const handleClearHistory = () => {
    readNovels.forEach(novel => {
      localStorage.removeItem(`checkpoint_${novel.NovelID}`);
    });
    setReadNovels([]); // Clear the state
  };

  return (
    <div className={`flex justify-center items-start p-32 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className={`shadow-md rounded-lg p-6 w-full max-w-4xl ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'}`}>
        <div className="flex">
          <div className="w-1/4">
            <h2 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>LỊCH SỬ</h2>
            <div className="mb-2">
              <button className={`flex items-center ${isDarkMode ? 'bg-gray-500 text-white' : 'bg-gray-200 text-black'} p-2 rounded-lg w-full`}>
                <i className="fas fa-eye mr-2"></i>
                <span>Sách đã đọc</span>
              </button>
            </div>
          </div>
          <div className="w-3/4 pl-4">
            <h2 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>SÁCH ĐÃ ĐỌC</h2>
            {readNovels.length === 0 ? (
              <div className="text-center">
                <img 
                  src="https://imgur.com/cx9u9rN.png" 
                  alt="No history icon"
                  className="mx-auto mb-2 w-40 h-40" // Set width and height to 25px (6rem in Tailwind)
                />
                <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
                  Bạn chưa đọc tiểu thuyết nào, đọc ngay nhé!!!
                </p>
              </div>
            ) : (
              readNovels.map(novel => (
                <div key={novel.NovelID} className={`p-4 rounded-lg mb-4 flex items-center ${isDarkMode ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'}`}>
                  <img src={novel.ImageUrl} alt={`Book cover of '${novel.Title}'`} className="w-24 h-36 rounded-lg mr-4"/>
                  <div className="flex-1">
                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{novel.Title}</h3>
                    <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Phần 1</p>
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
              ))
            )}
            {readNovels.length > 0 && (
              <button 
                onClick={handleClearHistory} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
              >
                Xóa lịch sử đọc
              </button>
            )}
          </div>
        </div>
      </div>
      {/* <UserStickyNote /> */}
    </div>
  );
}
