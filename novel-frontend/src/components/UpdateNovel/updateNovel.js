import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import { fetchChaptersByNovelId } from '../../services/apiService';

export default function UpdateNovel() {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const novel = location.state?.novel;
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChapters, setFilteredChapters] = useState([]);

  useEffect(() => {
    if (!novel || !novel._id || !loggedInUser) return;
  
    const fetchChapters = async () => {
      try {
        const data = await fetchChaptersByNovelId(novel._id);
        setChapters(data);
        setFilteredChapters(data);
      } catch (error) {
        console.error('Lỗi khi fetch danh sách chương:', error);
      }
    };
  
    fetchChapters();
  }, [novel, loggedInUser]); // <- thêm loggedInUser
  

  // Cập nhật danh sách chương theo từ khóa tìm kiếm
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = chapters.filter(chap =>
      (chap?.chapter || '').toLowerCase().includes(lowerSearch)
    );
    setFilteredChapters(filtered);
  }, [searchTerm, chapters]);

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để cập nhật truyện.</div>;
  }

  if (!novel) {
    return <div className="text-center mt-10">Không tìm thấy thông tin truyện.</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <AuthorSidebar activeView="updateNovel" />
      <main className="w-full md:w-3/4 p-4">
        <div className="flex flex-col md:flex-row mb-4">
          <img src={novel.imageUrl} alt="Book cover" className="w-24 h-36 mx-auto md:mx-0 md:mr-4 object-cover rounded" />
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold">{novel.title}</h3>
            <p>
              Thể loại:{' '}
              {Array.isArray(novel.idCategories)
                ? novel.idCategories.map(cat => 
                    typeof cat === 'object' && cat !== null && cat.titleCategory 
                      ? cat.titleCategory 
                      : cat
                  ).join(', ')
                : novel.idCategories}
            </p>
            <p>Số chương: {chapters.length}</p>
            <p>Tình trạng: <span className="text-green-600 font-bold">{novel.status || 'Đang cập nhật'}</span></p>
          </div>
        </div>

        <div className="mb-4 text-center">
          <button
            className={`px-4 py-2 rounded shadow-md ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
            onClick={() => alert('Thêm chương mới')}
          >
            + Thêm Chương
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm chương..."
            className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className={`min-w-full border ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}>
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Số thứ tự</th>
              <th className="py-2 px-4 border-b text-left">Chương</th>
              <th className="py-2 px-4 border-b text-left">Lượt xem</th>
              <th className="py-2 px-4 border-b text-left">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredChapters.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{item.title}</td>
                <td className="py-2 px-4 border-b">{item.view}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className={`hover:underline ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                    onClick={() => navigate('/chapter', { state: { chapter: item } })}
                  >
                    Cập nhật
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
