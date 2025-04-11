import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';

export default function Chapter() {
  const { loggedInUser } = useContext(UserContext);
  const [activeView, setActiveView] = useState('chapter'); // Add activeView for sidebar

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để chỉnh sửa chương.</div>;
  }

  const renderContent = () => {
    if (activeView === 'chapter') {
      return (
        <main className="w-3/4 p-8">
          <form enctype="multipart/form-data">
            <div className="mb-6">
              <label className="block font-bold mb-2">Tỉ lệ chia sẻ doanh thu</label>
              <input
                type="text"
                value="60% - 40%"
                disabled
                className="border border-gray-300 w-full rounded px-4 py-2 bg-gray-100"
              />
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2">Chương 1</label>
              <input
                type="text"
                value="Nhà ảo thuật"
                className="border border-gray-300 w-full rounded px-4 py-2"
              />
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2">Phần chữ</label>
              <textarea
                rows="10"
                className="border border-gray-300 w-full rounded px-4 py-2"
                defaultValue={`Kính Vạn Hoa 01: Nhà Ảo Thuật - Chương 1

Tháng tư bao giờ cũng bắt đầu bằng những ngày oi bức khó chịu. Hằng năm, vào mùa này mọi cư dân trong thành phố thường trằn trọc không ngủ. Dù nhà mở toang cửa sổ, suốt đêm cũng chỉ đón được dăm ba làn gió nhẹ thoảng qua và cứ đến gần sáng là mọi người thiếp đi trong giấc ngủ mê mệt.
Quý ròm dĩ nhiên không thể là một ngoại lệ, nhất là tối hôm qua nó thức khuya lơ khuya lắc ráng đọc cho xong cuốn "Toán học ứng dụng trong đời sống" mà nó vừa mua được chiều hôm trước.`}
              />
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2">Phần nổi</label>
              <div className="border border-gray-300 p-4 rounded">
                <label className="block mb-2">Set thời gian chuyển slide:</label>
                <input
                  type="number"
                  step="0.1"
                  className="border border-gray-300 rounded px-4 py-2 mb-4"
                  defaultValue="0.5"
                />
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((_, idx) => (
                    <input
                      key={idx}
                      type="file"
                      className="w-20 h-20 object-cover rounded shadow-md"
                      accept="image/*"
                    />
                  ))}
                </div>
              </div>
            </div>

            <button className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600">
              Lưu Thay Đổi
            </button>
          </form>
        </main>
      );
    }
    return null; // Add other views if needed
  };

  return (
    <div className="flex">
      <aside className="w-1/4 p-4 bg-gray-100 border-r">
        {/* Sidebar */}
        <div className="pt-6 pb-6 text-center mb-6 bg-blue-100 rounded-lg">
          <img
            src={loggedInUser.img || 'https://via.placeholder.com/150'} // Display user's avatar or placeholder
            alt="Admin Avatar"
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h2 className="text-xl font-bold mt-2">{loggedInUser.fullName || loggedInUser.username}</h2>
          <p className="text-sm text-gray-600">{loggedInUser.username}</p>
          <p className="text-sm text-gray-600">{loggedInUser.email}</p>
        </div>
        <ul className="space-y-4">
          <li
            className={`text-gray-700 flex items-center cursor-pointer hover:text-blue-500 ${activeView === 'profile' ? 'font-bold' : ''}`}
            onClick={() => setActiveView('profile')}
          >
            <span className="mr-2">👤</span> Hồ sơ cá nhân
          </li>
          <li
            className={`text-gray-700 flex items-center cursor-pointer hover:text-blue-500 ${activeView === 'listNovels' ? 'font-bold' : ''}`}
            onClick={() => setActiveView('listNovels')}
          >
            <span className="mr-2">📚</span> Truyện của tôi
          </li>
          <li
            className={`text-gray-700 flex items-center cursor-pointer hover:text-blue-500 ${activeView === 'createNovel' ? 'font-bold' : ''}`}
            onClick={() => setActiveView('createNovel')}
          >
            <span className="mr-2">➕</span> Thêm truyện mới
          </li>
          <li
            className={`text-gray-700 flex items-center cursor-pointer hover:text-blue-500 ${activeView === 'chapter' ? 'font-bold' : ''}`}
            onClick={() => setActiveView('chapter')}
          >
            <span className="mr-2">✏️</span> Chỉnh sửa chương
          </li>
          <li
            className={`text-gray-700 flex items-center cursor-pointer hover:text-blue-500 ${activeView === 'revenueTracking' ? 'font-bold' : ''}`}
            onClick={() => setActiveView('revenueTracking')}
          >
            <span className="mr-2">📈</span> Theo dõi doanh thu
          </li>
        </ul>
      </aside>
      {renderContent()}
    </div>
  );
}
