import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchNovels } from '../../services/apiService';
import { UserContext } from '../../context/UserContext';

export default function Update() {
  const [sortOrder, setSortOrder] = useState('latest');
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useContext(UserContext);

  useEffect(() => {
    const loadNovels = async () => {
      try {
        const data = await fetchNovels();
        setNovels(data);
      } catch (error) {
        console.error('Error fetching novels:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNovels();
  }, []);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedNovels = [...novels].sort((a, b) => {
    switch (sortOrder) {
      case 'latest':
        return new Date(b.createdAt) - new Date(a.createdAt); // Mới nhất
      case 'earliest':
        return new Date(a.createdAt) - new Date(b.createdAt); // Cũ nhất
      case 'mostViews':
        return b.view - a.view; // Nhiều view nhất
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="text-center mt-10">Đang tải dữ liệu...</div>;
  }

  if (novels.length === 0) {
    return <div className="text-center mt-10">Không có sách nào để hiển thị.</div>;
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Mới Cập Nhật</h2>
        <div className="mb-10 text-center">
          <label htmlFor="sortOrder" className="mr-2 text-gray-400">Sắp xếp theo:</label>
          <select
  id="sortOrder"
  value={sortOrder}
  onChange={handleSortChange}
  className={`border rounded px-2 py-1 transition-colors duration-200 
    ${isDarkMode 
      ? 'bg-gray-800 text-white border-gray-600' 
      : 'bg-white text-black border-gray-300'}`}
>
            <option value="latest">Mới nhất</option>
            <option value="earliest">Cũ nhất</option>
            <option value="mostViews">Truyện phổ biến</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
          {sortedNovels.map((novel) => (
            <div key={novel._id} className="text-center">
              <Link to={`/novelDetail/${novel._id}`}>
                <img
                  src={novel.imageUrl}
                  alt={`Book cover of ${novel.title}`}
                  className="mx-auto mb-2"
                  style={{ width: '180px', height: '250px', objectFit: 'cover' }}
                />
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>{novel.title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
