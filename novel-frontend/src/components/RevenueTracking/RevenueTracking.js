import React, { useContext, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, defs, linearGradient
} from 'recharts';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import { fetchNovelsByAuthor, fetchNovelRevenue } from '../../services/apiService';
import { 
  FiBook, FiShoppingCart, FiFileText, 
  FiChevronDown, FiChevronUp, FiTrendingUp, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';
import { FiDollarSign } from 'react-icons/fi';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#10B981'];
const COIN_CONVERSION_RATE = 5000; // 1 coin = 5,000 VND

export default function RevenueTracking() {
  const { isDarkMode, loggedInUser } = useContext(UserContext);
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [expandedNovel, setExpandedNovel] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const filterPurchasesByMonth = (purchases, month) => {
    if (!month) return purchases;
    return purchases.filter(p => {
      const purchaseDate = new Date(p.createdAt);
      return purchaseDate.getMonth() === month.getMonth() && 
             purchaseDate.getFullYear() === month.getFullYear();
    });
  };

  const calculateMonthlyStats = (purchases) => {
    const monthlyPurchases = purchases || [];
    return {
      purchases: monthlyPurchases,
      totalCoins: monthlyPurchases.reduce((sum, p) => sum + (p.price || 0), 0),
      totalChapters: new Set(monthlyPurchases.map(p => p.idChapter)).size,
      purchaseCount: monthlyPurchases.length,
      chapterStats: monthlyPurchases.reduce((stats, p) => {
        stats[p.idChapter] = (stats[p.idChapter] || 0) + 1;
        return stats;
      }, {})
    };
  };

  useEffect(() => {
    const fetchNovelsData = async () => {
      try {
        setLoading(true);
        const novelsData = await fetchNovelsByAuthor(loggedInUser._id);
        
        const novelsWithRevenue = await Promise.all(
          novelsData.map(async (novel) => {
            const revenueData = await fetchNovelRevenue(novel._id);
            const monthlyPurchases = filterPurchasesByMonth(revenueData.purchases, selectedMonth);
            const monthlyStats = calculateMonthlyStats(monthlyPurchases);
            return {
              ...novel,
              revenue: monthlyStats
            };
          })
        );
        
        setNovels(novelsWithRevenue);
      } catch (error) {
        setError('Lỗi khi tải dữ liệu truyện');
      } finally {
        setLoading(false);
      }
    };

    fetchNovelsData();
  }, [loggedInUser, selectedMonth]);

  const prepareChartData = () => {
    return novels.map(novel => ({
      name: novel.title,
      revenue: novel.revenue?.totalCoins || 0,
      purchases: novel.revenue?.purchaseCount || 0,
      chapters: novel.revenue?.totalChapters || 0
    }));
  };

  const toggleExpand = (novelId) => {
    setExpandedNovel(expandedNovel === novelId ? null : novelId);
  };

  return (
    <div className={`flex flex-col lg:flex-row ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <AuthorSidebar activeView="revenueTracking" />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-4">
          <h1 className="text-xl md:text-2xl font-bold">THỐNG KÊ DOANH THU TÁC GIẢ - Tháng {selectedMonth.getMonth() + 1}/{selectedMonth.getFullYear()}</h1>
          
          <div className="flex items-center justify-center md:justify-end space-x-4">
            <button 
              onClick={() => {
                const prevMonth = new Date(selectedMonth);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setSelectedMonth(prevMonth);
              }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FiChevronLeft />
            </button>
            
            <span className="font-medium">
              Tháng {selectedMonth.getMonth() + 1}/{selectedMonth.getFullYear()}
            </span>
            
            <button 
              onClick={() => {
                const nextMonth = new Date(selectedMonth);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setSelectedMonth(nextMonth);
              }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              disabled={selectedMonth.getMonth() === new Date().getMonth() && selectedMonth.getFullYear() === new Date().getFullYear()}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
              {/* Total Coins Card */}
              <div className={`p-4 md:p-6 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center`}>
                <div className="bg-blue-500 text-white p-3 rounded-full mr-4">
                  <FaCoins size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium">TỔNG SỐ COIN</h3>
                  <p className="text-2xl font-bold">
                    {novels.reduce((sum, novel) => sum + (novel.revenue?.totalCoins || 0), 0)} Coins
                  </p>
                </div>
              </div>
              
              {/* Total Chapters Card */}
              <div className={`p-4 md:p-6 rounded-lg ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} flex items-center`}>
                <div className="bg-green-500 text-white p-3 rounded-full mr-4">
                  <FiFileText size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium">TỔNG SỐ CHƯƠNG ĐÃ BÁN</h3>
                  <p className="text-2xl font-bold">
                    {novels.reduce((sum, novel) => sum + (novel.revenue?.totalChapters || 0), 0)}
                  </p>
                </div>
              </div>
              
              {/* Conversion Card */}
              <div className={`p-4 md:p-6 rounded-lg ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} flex items-center`}>
                <div className="bg-purple-500 text-white p-3 rounded-full mr-4">
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium">TỔNG TIỀN QUY ĐỔI</h3>
                  <p className="text-2xl font-bold">
                    {(novels.reduce((sum, novel) => sum + (novel.revenue?.totalCoins || 0), 0) * COIN_CONVERSION_RATE).toLocaleString('vi-VN')} VNĐ
                  </p>
                  <p className="text-xs mt-1">Tỷ giá: 1 Coin = 5,000 VNĐ</p>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className={`p-4 md:p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareChartData()}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} ${value === 1 ? 'Coin' : 'Coins'}`, 'Số coin']}
                      contentStyle={isDarkMode ? { backgroundColor: '#1F2937', borderColor: '#374151' } : {}}
                    />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      fill="url(#colorGradient)" 
                      name="Số coin"
                      radius={[4, 4, 0, 0]}
                      barSize={30}  // Narrower bar width
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List Section */}
            <div className="space-y-4">
              {novels.map(novel => (
                <div key={novel._id} className={`rounded-lg overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div 
                    className={`p-4 flex justify-between items-center cursor-pointer ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                    onClick={() => toggleExpand(novel._id)}
                  >
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded object-cover mr-4" src={novel.imageUrl || 'https://via.placeholder.com/40'} alt={novel.title} />
                      <div>
                        <h3 className="font-medium">{novel.title}</h3>
                        <div className="flex space-x-4 text-sm mt-1">
                          <span className="flex items-center"><FaCoins className="mr-1" /> {novel.revenue?.totalCoins || 0} {novel.revenue?.totalCoins === 1 ? 'Coin' : 'Coins'}</span>
                          <span className="flex items-center"><FiFileText className="mr-1" /> {novel.revenue?.totalChapters || 0} chương</span>
                          <span className="flex items-center"><FiShoppingCart className="mr-1" /> {novel.revenue?.purchaseCount || 0} lượt mua</span>
                        </div>
                      </div>
                    </div>
                    {expandedNovel === novel._id ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  
                  {expandedNovel === novel._id && (
                    <div className={`mt-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}>
                      <h4 className="font-medium mb-2">Chi tiết giao dịch</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">ID Chương</th>
                              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">ID Người dùng</th>
                              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Thời gian</th>
                              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Số coin</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {novel.revenue?.purchases?.map((purchase) => (
                              <tr key={`${purchase.idChapter}-${purchase.idUser}-${purchase.createdAt}`} className={isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{purchase.idChapter}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{purchase.idUser}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  {new Date(purchase.createdAt).toLocaleTimeString('vi-VN')} {new Date(purchase.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{purchase.price} Coins</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}