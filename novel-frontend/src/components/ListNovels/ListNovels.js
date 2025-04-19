import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { novels } from '../../data/data';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar'; // Import AuthorSidebar

export default function ListNovels() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNovels, setFilteredNovels] = useState(novels);
  const navigate = useNavigate();
  const { loggedInUser, isDarkMode } = useContext(UserContext); // Use global dark mode state

  useEffect(() => {
    setFilteredNovels(
      novels.filter(novel =>
        novel.Title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để xem danh sách truyện.</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <AuthorSidebar activeView="listNovels" /> {/* Use AuthorSidebar */}
      <main className="w-full md:w-3/4 p-4">
        <div className="w-full max-w-4xl p-4">
          <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
            Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam.
          </div>
          <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
            Truyện sau khi đăng đủ 5 chương mới có thể gửi duyệt.
          </div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">TỈ LỆ CHIA SẺ DOANH THU: 60% - 40%</h1>
            <button 
              className={`px-4 py-2 rounded ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}
              onClick={() => navigate('/createNovel')}
            >
              + THÊM TRUYỆN MỚI
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm Kiếm"
              className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            {filteredNovels.map((novel) => (
              <div key={novel.NovelID} className="border-b pb-4 mb-4">
                <div className="flex mb-4">
                  <img
                    src={novel.ImageUrl}
                    alt="Book cover"
                    className="w-32 h-48 mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{novel.Title}</h3>
                    <p>Thể loại: {novel.CategoryID}</p>
                    <p>Số chương: {novel.Chapters?.length || 0} chương</p>
                    <button 
                      className={`px-4 py-2 mt-5 rounded ${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`}
                      onClick={() => navigate('/updateNovel')}
                    >
                      CẬP NHẬT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
