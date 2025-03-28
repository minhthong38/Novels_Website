import React, { useState, useEffect } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueTracking = () => {
  const [chartData, setChartData] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalChaptersSold, setTotalChaptersSold] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  useEffect(() => {
    // Mock data for chapter purchases
    const mockData = [
      { month: 'January', chapterPurchases: 120 },
      { month: 'February', chapterPurchases: 150 },
      { month: 'March', chapterPurchases: 140 },
      { month: 'April', chapterPurchases: 180 },
      { month: 'May', chapterPurchases: 200 },
    ];

    const labels = mockData.map((data) => data.month);
    const chapterPurchasesData = mockData.map((data) => data.chapterPurchases);
    const incomeData = chapterPurchasesData.map((purchases) => purchases * 1000); // Calculate income

    // Calculate total revenue and total chapters sold
    const totalRevenue = incomeData.reduce((sum, value) => sum + value, 0);
    const totalChaptersSold = chapterPurchasesData.reduce((sum, value) => sum + value, 0);

    // Calculate percentage change compared to the first month
    const firstMonthRevenue = incomeData[0];
    const lastMonthRevenue = incomeData[incomeData.length - 1];
    const percentageChange = ((lastMonthRevenue - firstMonthRevenue) / firstMonthRevenue) * 100;

    console.log({ totalRevenue, totalChaptersSold, percentageChange }); // Debugging output

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Thống Kê Doanh Thu</h1>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-bold">Tổng Doanh Thu</h2>
          <p className="text-xl font-semibold text-blue-600">{totalRevenue.toLocaleString()} VNĐ</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-bold">Số Chương Đã Bán</h2>
          <p className="text-xl font-semibold text-green-600">{totalChaptersSold}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-bold">Tỷ Số Tăng/Giảm</h2>
          <p className={`text-xl font-semibold ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
              },
              title: {
                display: true,
                text: 'Biểu Đồ Doanh Thu và Lượt Mua Chương',
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default RevenueTracking;
