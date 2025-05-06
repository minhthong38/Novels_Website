import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import { fetchUserPurchases } from '../../services/apiService';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiBookOpen, FiUser, FiBook, FiCalendar } from 'react-icons/fi';
// import Skeleton from '../Skeleton';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueTracking = () => {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  // Calculate totals
  const totalRevenue = purchaseHistory.reduce((sum, purchase) => sum + purchase.price, 0);
  const totalChapters = purchaseHistory.length;

  // Process data for chart
  const processChartData = () => {
    const groupedData = {};
    
    purchaseHistory.forEach(purchase => {
      const date = new Date(purchase.purchaseDate).toLocaleDateString('vi-VN');
      if (!groupedData[date]) {
        groupedData[date] = {
          revenue: 0,
          chapters: 0
        };
      }
      groupedData[date].revenue += purchase.price;
      groupedData[date].chapters += 1;
    });
    
    const labels = Object.keys(groupedData).sort();
    const revenueData = labels.map(date => groupedData[date].revenue);
    const chaptersData = labels.map(date => groupedData[date].chapters);
    
    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu (VNĐ)',
          data: revenueData,
          backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Số chương bán',
          data: chaptersData,
          backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.7)' : 'rgba(16, 185, 129, 0.5)',
          yAxisID: 'y1',
        }
      ]
    };
  };

  const chartData = processChartData();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#f3f4f6' : '#111827',
        }
      },
      title: {
        display: true,
        text: 'Biểu đồ doanh thu và số chương bán',
        color: isDarkMode ? '#f3f4f6' : '#111827',
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#f3f4f6' : '#111827',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: isDarkMode ? '#f3f4f6' : '#111827',
          callback: function(value) {
            return value.toLocaleString('vi-VN') + ' VNĐ';
          }
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: isDarkMode ? '#f3f4f6' : '#111827',
        },
        grid: {
          drawOnChartArea: false,
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!loggedInUser) return;
      
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const purchases = await fetchUserPurchases(loggedInUser._id, token);
        setPurchaseHistory(purchases);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedInUser]);

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} min-h-screen`}>
      <AuthorSidebar activeView="revenueTracking" />
      <main className="w-full md:w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Thống Kê Doanh Thu</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} text-center`}>
            <h2 className="text-lg font-bold">Tổng Doanh Thu</h2>
            <p className="text-xl font-semibold">{totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
          </div>
          <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} text-center`}>
            <h2 className="text-lg font-bold">Tổng Chương Đã Bán</h2>
            <p className="text-xl font-semibold">{totalChapters}</p>
          </div>
        </div>

        {/* Chart */}
        {purchaseHistory.length > 0 && (
          <div className={`p-4 mb-6 rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
          </div>
        )}

        {/* {loading ? (
          <div className="space-y-4">
            <Skeleton height={60} count={5} />
          </div> )*/}
        : (
          <div className="overflow-x-auto">
            <div className="min-w-[800px] md:min-w-0">
              <table className="w-full divide-y">
                <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider md:px-6">Mã GD</th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider md:px-6">Người Mua</th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider md:px-6">Truyện</th>
                    <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider md:px-6">Chương</th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider md:px-6">Giá</th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider md:px-6">Ngày Mua</th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider md:px-6">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                  {purchaseHistory.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <FiBookOpen className={`text-4xl mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Không có giao dịch nào</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    purchaseHistory.map((purchase) => (
                      <tr 
                        key={purchase._id} 
                        className={`${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors duration-150`}
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-xs font-mono md:text-sm md:px-6">
                          {purchase._id.slice(-6)}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-xs md:text-sm md:px-6">
                          <div className="flex items-center">
                            <FiUser className="mr-1 md:mr-2 text-gray-500" />
                            <span className="truncate max-w-[80px] md:max-w-none">{purchase.idUser}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-xs md:text-sm md:px-6">
                          <div className="flex items-center">
                            <FiBook className="mr-1 md:mr-2 text-gray-500" />
                            <span className="truncate max-w-[100px] md:max-w-none">{purchase.idNovel.title}</span>
                          </div>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-xs md:text-sm md:px-6">
                          Ch. {purchase.idChapter.order}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-xs font-medium md:text-sm md:px-6">
                          {purchase.price.toLocaleString('vi-VN')} VNĐ
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-xs md:text-sm md:px-6">
                          <div className="flex items-center">
                            <FiCalendar className="mr-1 md:mr-2 text-gray-500" />
                            <span className="truncate max-w-[100px] md:max-w-none">
                              {new Date(purchase.purchaseDate).toLocaleString('vi-VN')}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-xs md:text-sm md:px-6">
                          <span className={`px-2 py-1 rounded-full text-xxs md:text-xs font-medium ${isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'}`}>
                            Hoàn thành
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      </main>
    </div>
  );
};

export default RevenueTracking;