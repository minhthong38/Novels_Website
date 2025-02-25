import React, { useState } from 'react';

function AdminSidebar() {
  const [showStoriesMenu, setShowStoriesMenu] = useState(false);

  const toggleStoriesMenu = () => {
    setShowStoriesMenu(!showStoriesMenu);
  };

  return (
    <aside className="lg:w-1/4 w-full p-4 h-auto bg-gray-100 border-r pb-40">
      {/* Admin Info */}
      <div className="pt-6 pb-6 text-center mb-6 bg-blue-100 rounded-lg">
        <img
          src="https://cdn0.iconfinder.com/data/icons/cryptocurrency-137/128/1_profile_user_avatar_account_person-132-512.png"
          alt="Admin Avatar"
          className="w-24 h-24 rounded-full mx-auto"
        />
        <h2 className="text-xl font-bold mt-2">Admin01</h2>
        <p className="text-sm text-gray-600">admin01@gmail.com</p>
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
          onClick={toggleStoriesMenu}
        >
          <span className="mr-2">👥</span> Danh sách
        </li>

        {showStoriesMenu && (
          <ul className="ml-4 space-y-2">
            <a
              href="/"
              className="text-gray-700 cursor-pointer hover:text-blue-500"
            >
              Danh sách User
            </a>
            <br></br>

            <a
              href="/create-story"
              className="text-gray-700 cursor-pointer hover:text-blue-500"
            >
              Danh sách Author
            </a>
          </ul>
        )}

        <li className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500">
          <span className="mr-2">🔔</span> Thông báo
        </li>
        <li className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500">
          <span className="mr-2">🧾</span> Lịch sử thanh toán
        </li>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
