import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchNovels } from '../../services/apiService'; // Import API service
import { UserContext } from '../../context/UserContext';

export default function Released() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useContext(UserContext);

  useEffect(() => {
    const loadNovels = async () => {
      try {
        const data = await fetchNovels(); // Fetch novels from API
        setNovels(data);
      } catch (error) {
        console.error('Error fetching novels:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNovels();
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const sortedNovels = [...novels].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return <div className="text-center mt-10">Đang tải dữ liệu...</div>;
  }

  if (novels.length === 0) {
    return <div className="text-center mt-10">Không có sách nào để hiển thị.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row mb-10">
      <div className="flex-1 px-4">
        <h2 className={`text-xl font-bold mb-8 text-center md:text-left md:ml-32 ${isDarkMode ? 'text-white' : 'text-black'}`}>VỪA RA MẮT</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
          {sortedNovels.slice(currentIndex, currentIndex + 4).map((novel) => (
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
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(sortedNovels.length / 4) }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${currentIndex === index * 4 ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => handleDotClick(index * 4)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
