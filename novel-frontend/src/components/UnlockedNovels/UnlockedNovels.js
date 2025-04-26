import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { fetchNovels } from '../../services/apiService';

export default function UnlockedNovels() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDarkMode, loggedInUser } = useContext(UserContext);

  useEffect(() => {
    const loadUnlockedNovels = async () => {
      try {
        console.log('Loading unlocked novels...');
        const allNovels = await fetchNovels();
        console.log('Fetched novels:', allNovels);
        
        // Lọc ra những truyện đã mở khóa
        const unlockedNovels = allNovels.filter(novel => {
          // Tạm thời hiển thị tất cả truyện để test
          return true;
        });
        
        console.log('Unlocked novels:', unlockedNovels);
        setNovels(unlockedNovels);
      } catch (err) {
        console.error('Error loading novels:', err);
        setError('Không thể tải danh sách truyện đã mở khóa');
      } finally {
        setLoading(false);
      }
    };

    loadUnlockedNovels();
  }, []);

  if (!loggedInUser) {
    return (
      <div className={`text-center mt-10 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Vui lòng đăng nhập để xem danh sách truyện đã mở khóa.
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center mt-10 ${isDarkMode ? 'text-red-300' : 'text-red-500'}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">DANH SÁCH TRUYỆN ĐÃ MỞ KHÓA</h1>
        
        {novels.length === 0 ? (
          <div className="text-center">
            <img src="https://imgur.com/33Se6Xs.jpg" alt="Không có truyện đã mở khóa" className="w-28 h-28 mx-auto mb-4" />
            <p className="text-lg">Bạn chưa mở khóa truyện nào.</p>
            <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block text-lg">
              Khám phá truyện ngay
            </Link>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`}>
            {novels.map((novel) => (
              <div
                key={novel._id}
                className={`border rounded-lg overflow-hidden shadow-lg ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
              >
                <Link to={`/novelDetail/${novel._id}`}>
                  <img 
                    src={novel.imageUrl || 'https://via.placeholder.com/300x400'} 
                    alt={novel.title} 
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link
                    to={`/novelDetail/${novel._id}`}
                    className="text-lg font-semibold hover:text-blue-500 block mb-2"
                  >
                    {novel.title}
                  </Link>
                  <p className="text-sm text-gray-500 mb-2">
                    {novel.description?.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      Lượt xem: {novel.view || 0}
                    </span>
                    <span className="text-sm text-green-500">
                      Đã mở khóa
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 