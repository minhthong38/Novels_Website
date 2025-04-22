import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { fetchFavoriteNovels, toggleFavorite } from '../services/apiService';

export default function FavoriteNovel() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loggedInUser, isDarkMode } = useContext(UserContext);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!loggedInUser?._id) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchFavoriteNovels(loggedInUser._id);
        console.log('Fetched favorites:', data);
        setFavorites(data);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [loggedInUser]);

  const handleRemoveFavorite = async (novelId) => {
    try {
      await toggleFavorite(loggedInUser._id, novelId);
      setFavorites(favorites.filter(fav => fav.idNovel._id !== novelId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để xem danh sách yêu thích.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <h1 className="text-2xl font-bold mb-6">Danh sách truyện yêu thích</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <p>Bạn chưa có truyện yêu thích nào.</p>
          <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">
            Khám phá truyện
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div 
              key={favorite._id}
              className={`rounded-lg shadow-lg overflow-hidden ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <Link to={`/novel/${favorite.idNovel._id}`}>
                <img 
                  src={favorite.idNovel.imageUrl} 
                  alt={favorite.idNovel.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link 
                  to={`/novel/${favorite.idNovel._id}`}
                  className="text-lg font-semibold hover:text-blue-500"
                >
                  {favorite.idNovel.title}
                </Link>
                <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {favorite.idNovel.description?.substring(0, 100)}...
                </p>
                <div className="mt-4">
                  <p className="text-sm">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Đã thêm vào: {new Date(favorite.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Lượt xem: {favorite.idNovel.view || 0}
                    </span>
                  </p>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.idNovel._id)}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    Xóa khỏi yêu thích
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
