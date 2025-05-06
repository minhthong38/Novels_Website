import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PaymentHistory() {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
 
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!loggedInUser || !loggedInUser.fullname) {
        console.error("Không tìm thấy thông tin tài khoản đăng nhập!");
        return;
      }
  
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/transactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Lọc giao dịch có nội dung chứa tên tài khoản đăng nhập
        const filteredTransactions = response.data.filter((tx) =>
          tx.orderInfo.includes(loggedInUser.fullname)
        );
  
        setTransactions(filteredTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, [loggedInUser]);

 

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
          <Link to="/userAccount" className={`px-6 py-3 rounded-md ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
            Quay lại
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-receipt text-4xl mb-4 text-gray-400"></i>
            <img
              src="https://imgur.com/cx9u9rN.png"
              alt="No history icon"
              className="mx-auto mb-2 w-32 h-32 sm:w-24 sm:h-24"
            />
            <p className="text-lg">Bạn chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-lg">
              <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-4 text-left font-medium uppercase tracking-wider">Mã GD</th>
                  <th className="px-8 py-4 text-left font-medium uppercase tracking-wider">ID Người dùng</th>
                  <th className="px-8 py-4 text-left font-medium uppercase tracking-wider">Thời gian</th>
                  <th className="px-8 py-4 text-left font-medium uppercase tracking-wider">Nội dung</th>
                  <th className="px-4 py-4 text-left font-medium uppercase tracking-wider">Số xu</th>
                  <th className="px-8 py-4 text-left font-medium uppercase tracking-wider">Số tiền</th>
                  <th className="px-4 py-4 text-left font-medium uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {paginatedTransactions.map((tx) => (
                  <tr key={tx._id} className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <td className="px-8 py-4 whitespace-nowrap">{tx._id.slice(-6)}</td>
                    <td className="px-8 py-4 whitespace-nowrap">{tx.idUser}</td>
                    <td className="px-8 py-4 whitespace-nowrap">{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                    <td className="px-8 py-4 whitespace-nowrap">{tx.orderInfo || 'Nạp xu'}</td>
                    <td className="px-8 py-4 whitespace-nowrap">{tx.coinsReceived}</td>
                    <td className="px-8 py-4 whitespace-nowrap">{tx.amount.toLocaleString('vi-VN')} VND</td>
                    <td className="px-8 py-4 whitespace-nowrap">{tx.transactionStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {transactions.length > itemsPerPage && (
          <div className="flex justify-center mt-6 space-x-4">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="px-4 py-2 bg-gray-500 text-white rounded" disabled={currentPage === 1}>
              Trang trước
            </button>
            <span className="px-4 py-2">Trang {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="px-4 py-2 bg-gray-500 text-white rounded" disabled={currentPage === totalPages}>
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;