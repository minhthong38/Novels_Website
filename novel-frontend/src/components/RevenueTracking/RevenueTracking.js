import React, { useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { UserContext } from '../../context/UserContext'; // Import UserContext
import AuthorSidebar from '../sidebar/AuthorSidebar'; // Import AuthorSidebar

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueTracking = () => {
  const { isDarkMode } = useContext(UserContext); // Use global dark mode state
  const [chartData, setChartData] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalChaptersSold, setTotalChaptersSold] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  useEffect(() => {
    const mockData = [
      { month: 'January', chapterPurchases: 120 },
      { month: 'February', chapterPurchases: 150 },
      { month: 'March', chapterPurchases: 140 },
      { month: 'April', chapterPurchases: 180 },
      { month: 'May', chapterPurchases: 200 },
    ];

    const labels = mockData.map((data) => data.month);
    const chapterPurchasesData = mockData.map((data) => data.chapterPurchases);
    const incomeData = chapterPurchasesData.map((purchases) => purchases * 1000);

    const totalRevenue = incomeData.reduce((sum, value) => sum + value, 0);
    const totalChaptersSold = chapterPurchasesData.reduce((sum, value) => sum + value, 0);

    const firstMonthRevenue = incomeData[0];
    const lastMonthRevenue = incomeData[incomeData.length - 1];
    const percentageChange = ((lastMonthRevenue - firstMonthRevenue) / firstMonthRevenue) * 100;

    setTotalRevenue(totalRevenue);
    setTotalChaptersSold(totalChaptersSold);
    setPercentageChange(percentageChange.toFixed(2));

    setChartData({
      labels,
      datasets: [
        {
          label: 'Thu Nhập (VNĐ)',
          data: incomeData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
        },
        {
          label: 'Lượt Mua Chương',
          data: chapterPurchasesData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
        },
      ],
    });
  }, []);

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <AuthorSidebar activeView="revenueTracking" /> {/* Use AuthorSidebar */}
      <main className="w-full md:w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Thống Kê Doanh Thu</h1>

        {/* Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg text-center shadow ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
            <h2 className="text-lg font-bold">Tổng Doanh Thu</h2>
            <p className="text-xl font-semibold">{totalRevenue.toLocaleString()} VNĐ</p>
          </div>
          <div className={`p-4 rounded-lg text-center shadow ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
            <h2 className="text-lg font-bold">Số Chương Đã Bán</h2>
            <p className="text-xl font-semibold">{totalChaptersSold}</p>
          </div>
          <div className={`p-4 rounded-lg text-center shadow ${isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-600'}`}>
            <h2 className="text-lg font-bold">Tỷ Số Tăng/Giảm</h2>
            <p className={`text-xl font-semibold ${percentageChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {percentageChange}%
            </p>
          </div>
        </div>

        {/* Line Chart */}
        {chartData && (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: isDarkMode ? 'white' : 'black', // Adjust legend text color for dark mode
                  },
                },
                title: {
                  display: true,
                  text: 'Biểu Đồ Doanh Thu và Lượt Mua Chương',
                  color: isDarkMode ? 'white' : 'black', // Adjust title text color for dark mode
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: isDarkMode ? 'white' : 'black', // Adjust x-axis tick color for dark mode
                  },
                },
                y: {
                  ticks: {
                    color: isDarkMode ? 'white' : 'black', // Adjust y-axis tick color for dark mode
                  },
                },
              },
            }}
          />
        )}
      </main>
    </div>
  );
};

export default RevenueTracking;
