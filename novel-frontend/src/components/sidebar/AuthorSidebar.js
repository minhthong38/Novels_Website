import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';

function AuthorSidebar() {
  const { loggedInUser } = useContext(UserContext);
  const [isListOpen, setIsListOpen] = useState(false);

  if (!loggedInUser) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="w-full lg:w-1/4 p-4 bg-gray-100 border-r lg:h-screen">
      {/* Admin Info */}
      <div className="pt-6 pb-6 text-center mb-6 bg-blue-100 rounded-lg">
        <img
          src={loggedInUser.avatar}
          alt="Admin Avatar"
          className="w-24 h-24 rounded-full mx-auto"
        />
        <h2 className="text-xl font-bold mt-2">{loggedInUser.displayName}</h2>
        <p className="text-sm text-gray-600">{loggedInUser.email}</p>
      </div>
      {/* Sidebar Menu */}
      <ul className="space-y-4">
        <li className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500">
          <span className="mr-2">👤</span> Hồ sơ cá nhân
        </li>
        <li className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500">
          <span className="mr-2">🔒</span> Đăng xuất / Thoát
        </li>
        <li
          className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500"
          onClick={() => setIsListOpen(!isListOpen)}
        >
          <span className="mr-2">👥</span> Danh sách truyện ▼
        </li>
        {isListOpen && (
          <ul className="ml-6 space-y-2">
            <li className="text-gray-700 cursor-pointer hover:text-blue-500">
              <a href="/listNovels">Truyện của tôi</a>
            </li>
            <li className="text-gray-700 cursor-pointer hover:text-blue-500">
              <a href="/createNovel">Thêm truyện mới</a>
            </li>
          </ul>
        )}
        <li className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500">
          <span className="mr-2">🔔</span> Thanh toán
        </li>
        <li className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500">
          <span className="mr-2">🧾</span> Doanh thu
        </li>
        <li className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500">
          <span className="mr-2">🧾</span> Lịch sử giao dịch
        </li>
      </ul>
    </aside>
  );
}

export default AuthorSidebar;
