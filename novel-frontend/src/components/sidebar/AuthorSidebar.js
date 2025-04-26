import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function AuthorSidebar({ activeView }) {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const navigate = useNavigate();

  if (!loggedInUser) {
    return null;
  }

  const menuItems = [
    { label: 'Hồ sơ cá nhân', icon: '👤', view: 'profile', path: '/authorAccounts' },
    { label: 'Truyện của tôi', icon: '📚', view: 'listNovels', path: '/listNovels' },
    { label: 'Thêm truyện mới', icon: '➕', view: 'createNovel', path: '/createNovel' },
    { label: 'Cập nhật truyện', icon: '✏️', view: 'updateNovel', path: '/updateNovel' },
    { label: 'Theo dõi doanh thu', icon: '📈', view: 'revenueTracking', path: '/revenueTracking' },
  ];

  return (
    <aside className={`w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-black border-gray-300'}`}>
      <div className={`pt-6 pb-6 text-center mb-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
        <img
          src={loggedInUser.avatar || 'https://via.placeholder.com/150'} // Use avatar from loggedInUser
          alt="Admin Avatar"
          className="w-24 h-24 rounded-full mx-auto"
        />
        <h2 className="text-xl font-bold mt-2">{loggedInUser.fullName || loggedInUser.username}</h2>
        <p className="text-sm">{loggedInUser.username}</p>
        <p className="text-sm">{loggedInUser.email}</p>
      </div>
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
