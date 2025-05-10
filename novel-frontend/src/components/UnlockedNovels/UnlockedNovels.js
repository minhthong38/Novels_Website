import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { fetchUserPurchases } from '../../services/apiService';
import { FiBookOpen, FiBook, FiCalendar, FiDollarSign, FiChevronRight } from 'react-icons/fi';

export default function UnlockedNovels() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDarkMode, loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      if (!loggedInUser) return;
      
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const purchases = await fetchUserPurchases(loggedInUser._id, token);
      console.log('Purchases:', purchases);
      setChapters(purchases);
      setError('');
    } catch (err) {
      console.error('Error loading unlocked chapters:', err);
      setError('Không thể tải danh sách chương đã mở khóa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loggedInUser]);

  if (!loggedInUser) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
        <FiBookOpen className="text-4xl mb-4 text-blue-500" />
        <h2 className="text-xl font-semibold mb-2">Yêu cầu đăng nhập</h2>
        <p className="mb-4">Vui lòng đăng nhập để xem danh sách chương đã mở khóa</p>
        <Link 
          to="/login" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Đang tải danh sách chương...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md w-full" role="alert">
          <div className="flex items-center">
            <FiBookOpen className="text-red-500 mr-2" />
            <p className="font-bold">Lỗi tải dữ liệu</p>
          </div>
          <p className="mt-2">{error}</p>
          <button 
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            <FiBookOpen className="inline mr-2 text-blue-500" />
            Chương Đã Mở Khóa
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
            {chapters.length} chương
          </span>
        </div>
        
        {chapters.length === 0 ? (
          <div className="text-center py-16">
            <FiBookOpen className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Không có chương nào đã mở khóa</h3>
            <p className="mt-2 text-gray-500">Bạn chưa mua bất kỳ chương truyện nào.</p>
            <div className="mt-6">
              <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Khám phá truyện ngay
              </Link>
            </div>
          </div>
        ) : (
          <div className={`overflow-hidden rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Truyện</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Chương</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Giá</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày mở khóa</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Xem</span></th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                  {chapters.map((purchase) => (
                    <tr 
                      key={purchase._id} 
                      className={`${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded object-cover" 
                              src={purchase.idNovel.imageUrl || 'https://via.placeholder.com/40'} 
                              alt={purchase.idNovel.title} 
                            />
                          </div>
                          <div className="ml-4">
                            <Link 
                              to={`/novelDetail/${purchase.idNovel._id}`} 
                              className="text-sm font-medium hover:text-blue-500 transition-colors"
                            >
                              {purchase.idNovel.title}
                            </Link>
                            <div className="flex items-center mt-1">
                              <img 
                                className="h-4 w-4 rounded-full mr-1" 
                                src={purchase.idUser?.avatar || 'https://via.placeholder.com/16'} 
                                alt={purchase.idUser?.fullname} 
                              />
                              <Link 
                                to={`/author/${purchase.idUser?._id}`}
                                className="text-xs text-gray-500 hover:text-blue-500 hover:underline"
                              >
                                {purchase.idUser?.fullname || 'Tác giả chưa rõ'}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/novel/${purchase.idNovel._id}/read?chapterId=${purchase.idChapter._id}`}
                          className="text-sm font-medium hover:text-blue-500 transition-colors"
                        >
                          Chương {purchase.idChapter.order}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'}`}>
                          {purchase.price?.toLocaleString('vi-VN') || '0'} VNĐ
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(purchase.purchaseDate).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/novel/${purchase.idNovel._id}/read?chapterId=${purchase.idChapter._id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                        >
                          Xem <FiChevronRight className="ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}