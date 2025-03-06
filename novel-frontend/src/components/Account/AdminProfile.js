import React, { useState, useEffect } from 'react';
import AdminRoute from '../routes/AdminRoute';
import { users } from '../../data/data';

export default function AdminProfile() {
  const [userList, setUserList] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    setUserList([...users]);
  }, [users]);

  const handleRequestClick = (user) => {
    setSelectedUser(user);
  };

  const handleApprove = () => {
    const updatedUser = { ...selectedUser, authorRequest: false, role: 'author' };
    const userIndex = users.findIndex(user => user.id === selectedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
    }
    setUserList([...users]);
    setSelectedUser(null);
    // Send notification
    const notification = {
      userId: selectedUser.id,
      message: 'Tài khoản của bạn đã được duyệt cho vai trò tác giả.'
    };
    localStorage.setItem(`notification_${selectedUser.id}`, JSON.stringify(notification));
  };

  const handleReject = () => {
    const updatedUser = { ...selectedUser, authorRequest: false };
    const userIndex = users.findIndex(user => user.id === selectedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
    }
    setUserList([...users]);
    setSelectedUser(null);
  };

  return (
    <AdminRoute>
      <main className="w-3/4 p-4">
        <h1 className="text-center text-2xl font-bold mb-4">-TABLE USER-</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">STT</th>
              <th className="border border-gray-300 p-2">Hình Ảnh</th>
              <th className="border border-gray-300 p-2">Tài Khoản</th>
              <th className="border border-gray-300 p-2">Mật Khẩu</th>
              <th className="border border-gray-300 p-2">Cấp Độ</th>
              <th className="border border-gray-300 p-2">Cập Nhật</th>
              <th className="border border-gray-300 p-2">Yêu Cầu</th>
            </tr>
          </thead>
          <tbody>
            {userList.map(user => (
              <tr key={user.id} className="text-center">
                <td className="border border-gray-300 p-2">{user.id}</td>
                <td className="border border-gray-300 p-2">
                  <img 
                    src={user.img} 
                    alt={`User ${user.username} profile picture`} 
                    className="rounded-full mx-auto w-12 h-12 object-cover"
                  />
                </td>
                <td className="border border-gray-300 p-2">{user.username}</td>
                <td className="border border-gray-300 p-2">{user.password}</td>
                <td className="border border-gray-300 p-2">{user.level}</td>
                <td className="border border-gray-300 p-2">
                  <a href="#" className="text-green-500 mr-2">Cập nhật</a>
                  <a href="#" className="text-red-500">Xóa</a>
                </td>
                <td className="border border-gray-300 p-2">
                  {user.authorRequest ? (
                    <button 
                      className="text-blue-500"
                      onClick={() => handleRequestClick(user)}
                    >
                      Có 1 yêu cầu
                    </button>
                  ) : (
                    'Không có yêu cầu'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Yêu cầu làm tác giả</h2>
              <p><strong>Tài khoản:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Giới tính:</strong> {selectedUser.gender}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  className="bg-red-500 text-white py-2 px-4 rounded-lg"
                  onClick={handleReject}
                >
                  Từ chối
                </button>
                <button 
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                  onClick={handleApprove}
                >
                  Phê duyệt
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminRoute>
  );
}
