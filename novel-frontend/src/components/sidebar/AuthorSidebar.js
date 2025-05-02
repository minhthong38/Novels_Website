import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getWalletByUserId } from '../../services/apiService';
import { requestImmediateWithdrawal } from '../../services/apiService';

export default function AuthorSidebar({ activeView }) {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null); // State để lưu ví doanh thu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(10000);
  const [errorMessage, setErrorMessage] = useState('');

  // Gọi API getWalletByUserId khi loggedInUser có giá trị
  useEffect(() => {
    const fetchWallet = async () => {
      if (loggedInUser) {
        try {
          const walletData = await getWalletByUserId(loggedInUser.id);
          console.log("Ví doanh thu:", loggedInUser);
          
          setWallet(walletData || null);
        } catch (error) {
          console.error("Lỗi khi lấy ví:", error);
          setWallet(null);
        }
      }
    };
    fetchWallet();
  }, [loggedInUser]); // Chạy lại khi loggedInUser thay đổi

  if (!loggedInUser) return null;

  const menuItems = [
    { label: 'Hồ sơ cá nhân', icon: '👤', view: 'profile', path: '/authorAccounts' },
    { label: 'Truyện của tôi', icon: '📚', view: 'listNovels', path: '/listNovels' },
    { label: 'Thêm truyện mới', icon: '➕', view: 'createNovel', path: '/createNovel' },
    { label: 'Cập nhật truyện', icon: '✏️', view: 'updateNovel', path: '/updateNovel' },
    { label: 'Theo dõi doanh thu', icon: '📈', view: 'revenueTracking', path: '/revenueTracking' },
  ];

  const handleWithdrawClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleWithdrawSubmit = async () => {
    if (withdrawAmount < 10000) {
      setErrorMessage('Số tiền rút tối thiểu là 10,000 VNĐ');
      return;
    }
    setErrorMessage('');
  
    try {
      const res = await requestImmediateWithdrawal(withdrawAmount); // Gọi API với amount duy nhất
      alert(res.message || 'Yêu cầu rút tiền đã được gửi');
      setWithdrawAmount(10000);
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message || 'Có lỗi xảy ra khi gửi yêu cầu rút tiền');
    }
  };

  return (
    <aside className={`w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-black border-gray-300'}`}>
      <div className={`pt-6 pb-6 text-center mb-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
        <img
          src={loggedInUser.avatar || 'https://via.placeholder.com/150'}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto"
        />
        <h2 className="text-xl font-bold mt-2">{loggedInUser.fullName || loggedInUser.username}</h2>
        <p className="text-sm">{loggedInUser.username}</p>
        <p className="text-sm">{loggedInUser.email}</p>
        <div className="flex justify-center items-center mt-2">
          <span className="mr-2">Ví doanh thu:</span>
          <span>
            {wallet ? `${wallet.totalRevenue.toLocaleString('vi-VN')} VNĐ` : 'Đang tải...'}
            <i className="fas fa-coins text-yellow-500 ml-2"></i>
          </span>
        </div>
        <div className="mt-4">
          <button
            onClick={handleWithdrawClick}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Rút Tiền
          </button>
        </div>
      </div>

      {/* Modal Rút Tiền */}
      {isModalOpen && (
        <div className="fixed inset-0 text-black bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-center mb-4">Rút Tiền</h2>
            <div className="mb-4">
              <label htmlFor="withdrawAmount" className="block text-sm font-medium mb-2">Số tiền muốn rút (VNĐ):</label>
              <input
                type="number"
                id="withdrawAmount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full p-2 border text-black border-gray-300 rounded-md"
                min="10000"
              />
            </div>
            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleWithdrawSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Xác Nhận Rút
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.view}
            className={`flex items-center cursor-pointer hover:text-blue-500 ${activeView === item.view ? 'font-bold' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="mr-2">{item.icon}</span> {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
