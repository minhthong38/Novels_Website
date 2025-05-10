import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// import AuthorStickyNote from "../AuthorStickyNote";
import { fetchAuthorDetails } from '../../services/apiService';

export default function Authors () {
  const { userId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [novels, setNovels] = useState([]);



  useEffect(() => {
    const loadAuthorData = async () => {
      try {
        const authorData = await fetchAuthorDetails(userId);
        // Nếu authorData là mảng, lấy phần tử đầu tiên
        // Lưu novel đầu tiên để lấy thông tin tác giả, lưu toàn bộ danh sách để render truyện
        const novels = Array.isArray(authorData) ? authorData : [authorData];
        setAuthor(novels[0]);
        setNovels(novels);
        console.log('Author data from API:', authorData);
      } catch (error) {
        console.error("Error loading author data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthorData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!author) return <div>Author not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-2 transition-colors duration-300">
      <div className="max-w-3xl mx-auto animate-fadeIn">

        {/* Author Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 flex flex-col items-center mb-10 border border-blue-100 dark:border-gray-700 transition-colors duration-300">
          <div className="relative mb-4">
            <img
              src={author?.idUser?.avatar || author?.avatar || '/default-avatar.png'}
              alt={author?.idUser?.fullname || 'No name'}
              className="w-40 h-40 rounded-full border-4 border-blue-200 dark:border-gray-600 shadow-lg object-cover transition-transform duration-300 hover:scale-105"
            />
            <span className="absolute bottom-2 right-2 bg-green-400 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800"></span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-1 tracking-tight text-center">
            {author?.idUser?.fullname || 'No name'}
          </h1>
          <p className="text-lg text-blue-500 dark:text-blue-300 mb-2 text-center">@{author?.idUser?.username || 'No username'}</p>
          <p className="text-gray-500 dark:text-gray-300 text-center mb-2">{author?.idUser?.email}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {/* Hiển thị tất cả thể loại mà tác giả đã viết */}
            {(() => {
              // Gom tất cả thể loại từ các truyện của tác giả
              const allCategories = novels
                .flatMap(novel => novel.idCategories || [])
                .filter(cat => cat && cat._id && cat.titleCategory);
              // Lọc trùng theo _id
              const uniqueCategories = Array.from(
                new Map(allCategories.map(cat => [cat._id, cat])).values()
              );
              return uniqueCategories.map(cat => (
                <span key={cat._id} className="bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {cat.titleCategory}
                </span>
              ));
            })()}
          </div>
          <div className="flex gap-6 mt-3 mb-1 text-center">
            <div>
              <span className="block text-xl font-bold text-pink-500 dark:text-pink-300">{author?.view || 0}</span>
              <span className="text-xs text-gray-400 dark:text-gray-300">Lượt xem</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-yellow-500 dark:text-yellow-300">{author?.rate || 0}</span>
              <span className="text-xs text-gray-400 dark:text-gray-300">Đánh giá</span>
            </div>
          </div>
        </div>
        {/* Novels Grid */}
        <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-100">Tác phẩm nổi bật</h2>
        {novels && novels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {novels.map(novel => (
              <Link
                key={novel._id}
                to={`/novelDetail/${novel._id}`}
                className="block focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-xl"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-lg hover:shadow-2xl dark:hover:shadow-2xl transition-shadow duration-300 p-4 flex flex-col items-center group border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-400 cursor-pointer"
                >
                  <img
                    src={novel.imageUrl}
                    alt={novel.title}
                    className="w-36 h-52 rounded-lg object-cover mb-3 group-hover:scale-105 transition-transform duration-300 shadow"
                  />
                  <p className="font-semibold text-base text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-center mb-1 truncate w-full" title={novel.title}>{novel.title}</p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {novel.idCategories && novel.idCategories.map(cat => (
                      <span key={cat._id} className="bg-pink-100 dark:bg-gray-700 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full text-xs font-medium">
                        {cat.titleCategory}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center mb-10 text-gray-400 dark:text-gray-300">Không có tác phẩm nào</p>
        )}
        {/* <AuthorStickyNote /> */}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
