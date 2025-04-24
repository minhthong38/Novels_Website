import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchNovels } from '../../services/apiService';
import { UserContext } from '../../context/UserContext';

export default function Released() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Display 5 novels per page

  const handleDotClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  useEffect(() => {
    const loadNovels = async () => {
      try {
        const data = await fetchNovels();
        setNovels(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error fetching novels:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNovels();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (novels.length === 0) {
    return <div className="text-center mt-10 text-lg">Không có sách nào để hiển thị.</div>;
  }

  const paginatedNovels = novels.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <h2 className="text-4xl font-extrabold mb-8 text-center tracking-wide">MỚI RA MẮT</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {paginatedNovels.map((novel) => (
          <div
            key={novel._id}
            className={`relative rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <Link to={`/novelDetail/${novel._id}`}>
              <div className="relative overflow-hidden">
                {/* New Badge */}
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  New
                </span>
                <img
                  src={novel.imageUrl}
                  alt={`Book cover of ${novel.title}`}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-sm px-4 text-center">{novel.description?.substring(0, 100)}...</p>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold hover:text-blue-500 transition duration-300 truncate">
                  {novel.title}
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {novel.idUser?.fullname || 'Tác giả không xác định'}
                </p>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(novel.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        {Array.from({ length: Math.ceil(novels.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${
              currentPage === index ? 'bg-blue-500' : 'bg-gray-300 hover:bg-blue-400'
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
