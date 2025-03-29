import React, { useState, useContext, useEffect } from "react";
import { UserContext } from '../../context/UserContext'; // Ensure this import is correct and not causing a loop
import ListNovels from '../ListNovels/ListNovels';
import CreateNovel from '../createNovel/CreateNovel';
import UpdateNovel from '../UpdateNovel/updateNovel';
import RevenueTracking from '../RevenueTracking/RevenueTracking'; // Import RevenueTracking component

function AuthorAccounts() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [activeView, setActiveView] = useState('profile'); // State to toggle views
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (loggedInUser) {
      setDisplayName(loggedInUser.fullName || loggedInUser.username); // Use fullName as displayName
      setUsername(loggedInUser.username);
      setPassword(loggedInUser.password);
      setEmail(loggedInUser.email || '');
      setIntroduction(loggedInUser.introduction || '');
      setAvatar(loggedInUser.img || 'https://via.placeholder.com/150'); // Use avatar or placeholder
    }
  }, [loggedInUser]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    const updatedUser = {
      ...loggedInUser,
      displayName,
      username,
      password,
      email,
      introduction,
      img: avatar, // Update avatar
    };
    setLoggedInUser(updatedUser);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'listNovels':
        return <ListNovels />;
      case 'createNovel':
        return <CreateNovel />;
      case 'updateNovel':
        return <UpdateNovel />;
      case 'revenueTracking': // Add case for revenue tracking
        return <RevenueTracking />;
      default:
        return (
          <div>
            <div className="bg-red-200 m-4 text-red-700 text-center py-3 font-semibold text-sm mb-4">
              Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam. Tác giả lưu ý khi đăng tải tác phẩm. Nếu vi phạm bạn có thể bị khóa truyện, nếu tái phạm có thể bị khóa tài khoản vĩnh viễn.
            </div>

            {/* Cấp bậc */}
            <div className="mb-4 text-center">
              <label htmlFor="image-upload" className="cursor-pointer">
                <img
                  src={avatar}
                  alt="avatar"
                  className="rounded-full mx-auto w-24 h-24 mb-2 border-4"
                />
              </label>
              <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} />
              <p className="text-lg font-bold">{displayName}</p>
              <p className="text-gray-600 text-sm">Chưa có cấp bậc</p>
              <p className="text-sm text-gray-700 mt-2">
                Tỷ lệ chia sẻ doanh thu: <span className="font-bold">60% - 40%</span>
              </p>
            </div>

            {/* Thống kê */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-center">
              <div className="border rounded-lg py-2 shadow">
                <p className="text-sm text-gray-500">Tổng truyện đã đăng</p>
                <p className="text-lg font-bold text-gray-800">0</p>
              </div>
              <div className="border rounded-lg py-2 shadow">
                <p className="text-sm text-gray-500">Tổng chương đã đăng</p>
                <p className="text-lg font-bold text-gray-800">0</p>
              </div>
              <div className="border rounded-lg py-2 shadow">
                <p className="text-sm text-gray-500">Tổng lượt đọc</p>
                <p className="text-lg font-bold text-gray-800">0</p>
              </div>
            </div>

            {/* Điều kiện nâng cấp */}
            <div className="bg-gray-50 p-4 border rounded-lg mb-4">
              <p className="text-gray-700 font-semibold">Bạn chưa đủ điều kiện tăng cấp.</p>
              <ul className="list-disc list-inside text-gray-600 text-sm mt-2">
                <li>Bạn phải có ít nhất 1 truyện được duyệt.</li>
              </ul>
            </div>

            {/* Chi tiết thông tin */}
            <div className="space-y-2 text-gray-700 text-sm">
              <div>
                <label className="font-semibold">Tên tác giả:</label>
                <input 
                  type="text" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="font-semibold">Tên đăng nhập:</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="font-semibold">Mật khẩu:</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="font-semibold">Email:</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="font-semibold">Giới thiệu:</label>
                <textarea 
                  value={introduction} 
                  onChange={(e) => setIntroduction(e.target.value)} 
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>
            </div>

            {/* Nút lưu thay đổi */}
            <div className="text-center mt-6">
              <button 
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                onClick={handleSaveChanges}
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        );
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để truy cập tài khoản tác giả.</div>;
  }

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
          <h2 className="text-xl font-bold mt-2">{loggedInUser.fullName || loggedInUser.username}</h2> {/* Display fullName */}
          <p className="text-sm text-gray-600">{loggedInUser.username}</p> {/* Display username */}
          <p className="text-sm text-gray-600">{loggedInUser.email}</p> {/* Display email */}
        </div>
        <ul className="space-y-4">
          <li
            className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500"
            onClick={() => setActiveView('profile')}
          >
            <span className="mr-2">👤</span> Hồ sơ cá nhân
          </li>
          <li
            className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500"
            onClick={() => setActiveView('listNovels')}
          >
            <span className="mr-2">📚</span> Truyện của tôi
          </li>
          <li
            className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500"
            onClick={() => setActiveView('createNovel')}
          >
            <span className="mr-2">➕</span> Thêm truyện mới
          </li>
          <li
            className="text-gray-700 flex items-center cursor-pointer hover:text-blue-500"
            onClick={() => setActiveView('revenueTracking')} // New menu item
          >
            <span className="mr-2">📈</span> Theo dõi doanh thu
          </li>
        </ul>
      </aside>
      <div className="w-3/4 p-4">{renderContent()}</div>
    </div>
  );
}

export default AuthorAccounts;
