import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { fetchFavoriteNovels, toggleFavorite } from "../services/apiService";


export default function FavoriteNovel() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loggedInUser, isDarkMode } = useContext(UserContext);

  useEffect(() => {
    const user = loggedInUser._id || loggedInUser.id;
    console.log("User ID:", user);
    if (!user) {
      console.warn("Chưa có loggedInUser._id khi load favorite");
      setLoading(false);
      return;
    }
  
    console.log("Đã có loggedInUser._id:", loggedInUser._id);
    
  
    const loadFavorites = async () => {
      try {
        const data = await fetchFavoriteNovels(user);
        setFavorites(data);
      } catch (error) {
        console.error("Lỗi tải danh sách yêu thích:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadFavorites();
  }, [loggedInUser]);
  

  const handleRemoveFavorite = async (novelId) => {
    try {
      const user = loggedInUser._id || loggedInUser.id;
      await toggleFavorite(user, novelId);
      setFavorites(favorites.filter((fav) => fav.idNovel._id !== novelId));
    } catch (error) {
      console.error("Lỗi khi xóa khỏi danh sách yêu thích:", error);
    }
  };

  const handleRemoveAllFavorites = async () => {
    try {
      for (const fav of favorites) {
        const user = loggedInUser._id || loggedInUser.id;
        await toggleFavorite(user, fav.idNovel._id);
      }
      setFavorites([]);
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ danh sách yêu thích:", error);
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10 text-lg">Vui lòng đăng nhập để xem danh sách yêu thích.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="max-w-screen-xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-6"> DANH SÁCH YÊU THÍCH </h1>
        {favorites.length > 0 && (
          <button
            onClick={handleRemoveAllFavorites}
            className="mb-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
          >
            Xóa toàn bộ
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center">
          <img src="https://imgur.com/33Se6Xs.jpg" alt="Không có truyện yêu thích" className="w-28 h-28 mx-auto mb-4" />
          <p className="text-lg">Bạn chưa có truyện yêu thích nào.</p>
          <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block text-lg">
            Khám phá truyện ngay
          </Link>
        </div>
      ) : (
        <div className={`bg-${isDarkMode ? "gray-800" : "white"} shadow-md rounded-lg p-6`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite._id}
                className={`border border-gray-300 rounded-lg overflow-hidden ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
                }`}
              >
                <Link to={`/novelDetail/${favorite.idNovel._id}`}>
                  <img src={favorite.idNovel.imageUrl} alt={favorite.idNovel.title} className="w-full h-48 object-cover" />
                </Link>
                <div className="p-4 text-center">
                  <Link
                    to={`/novelDetail/${favorite.idNovel._id}`}
                    className="text-lg font-semibold hover:text-blue-500"
                  >
                    {favorite.idNovel.title}
                  </Link>
                  <p className="mt-2 text-sm">{favorite.idNovel.description?.substring(0, 80)}...</p>
                  <p className="mt-2 text-xs text-gray-400">
                    Đã thêm vào: {new Date(favorite.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.idNovel._id)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Xóa khỏi yêu thích
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}