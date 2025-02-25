import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import UserStickyNote from '../UserStickyNote';

export default function UserAccount() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [avatarImage, setAvatarImage] = useState(loggedInUser ? loggedInUser.avatar : "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfMk9krvF3lSmqd78EvF2m8RSEOk8aFoUJ_Lb5oSQo1cO3i5jj7fWDPcVEO3Tx79Ubfje2ivLX_hhzxYI2zEvhXXDpCOoAK35p1r4fzeEwS5EuaQWwMpPQNTncJprLsgdfe6E2tUderusU0N12m6xz3OGj7?key=v8ba6Z10Wr-7QNx-8gMTgw");
  const [displayName, setDisplayName] = useState(loggedInUser ? loggedInUser.username : "Nguyễn Văn A");
  const [email, setEmail] = useState(loggedInUser ? loggedInUser.email : "nguyenvana@gmail.com");
  const [gender, setGender] = useState(loggedInUser ? loggedInUser.gender : "Nam");
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [newEmail, setNewEmail] = useState(email);
  const [newGender, setNewGender] = useState(gender);

  useEffect(() => {
    if (loggedInUser) {
      setAvatarImage(loggedInUser.avatar);
      setDisplayName(loggedInUser.username);
      setEmail(loggedInUser.email);
      setGender(loggedInUser.gender);
      setNewDisplayName(loggedInUser.username);
      setNewEmail(loggedInUser.email);
      setNewGender(loggedInUser.gender);
    }
  }, [loggedInUser]);

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    const updatedUser = {
      ...loggedInUser,
      avatar: uploadedImage || avatarImage,
      username: newDisplayName,
      email: newEmail,
      gender: newGender
    };
    setLoggedInUser(updatedUser);
    setAvatarImage(updatedUser.avatar);
    setDisplayName(updatedUser.username);
    setEmail(updatedUser.email);
    setGender(updatedUser.gender);
    setUploadedImage(null);
  };

  return (
    <div className="flex flex-col md:flex-row p-4">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          {/* Avatar Image */}
          <img src={avatarImage} alt="User avatar" className="rounded-full w-24 h-24 mb-4" />
          <h2 className="text-lg font-semibold">{displayName}</h2>
          <p className="text-gray-600">{email}</p>
          <p className="text-gray-600">{gender}</p>
          <button className="mt-4 text-red-500">Hồ sơ cá nhân</button>
          <button className="mt-2 text-blue-500">Đăng xuất/Thoát</button>
          <button className="mt-2 text-green-500">Tham gia vai trò tác giả</button> {/* New button */}
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span>Ví chi tiêu</span>
            <span>0.00 <i className="fas fa-coins text-yellow-500"></i></span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span>Ví doanh thu</span>
            <span>0.00 <i className="fas fa-coins text-yellow-500"></i></span>
          </div>
        </div>
        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg">NẠP COIN</button>
        <ul className="mt-4 space-y-2">
          <li className="flex items-center"><i className="fas fa-credit-card mr-2"></i> <a href="#!">Thanh toán</a></li>
          <li className="flex items-center"><i className="fas fa-heart mr-2"></i> <a href="#!">Yêu thích</a></li>
          <li className="flex items-center"><i className="fas fa-book mr-2"></i> <a href="#!">Truyện đã mở khóa</a></li>
          <li className="flex items-center"><i className="fas fa-bell mr-2"></i> <a href="#!">Thông báo</a></li>
          <li className="flex items-center"><i className="fas fa-history mr-2"></i> <a href="/history">Lịch sử đọc</a></li>
          <li className="flex items-center"><i className="fas fa-receipt mr-2"></i> <a href="#!">Lịch sử thanh toán</a></li>
          <li className="flex items-center"><i className="fas fa-key mr-2"></i> <a href="#!">Đổi mật khẩu</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 bg-white p-4 rounded-lg shadow-md mt-4 md:mt-0 md:ml-4">
        {/* Premium Package Section */}
        <div className="border p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span>Gói Premium:</span>
            <button className="bg-red-500 text-white py-1 px-4 rounded-lg">Nâng cấp ngay</button>
          </div>
          <div className="mt-2">
            <span>Gói hiện tại: Thường</span>
          </div>
          <div className="mt-2">
            <span>Hạn gói hiện tại:</span>
          </div>
        </div>

        {/* Current Level Section */}
        <div className="mt-4">
          <span>Cấp độ hiện tại: VIP 0</span>
          <div className="flex items-center mt-2">
            {/* Using avatarImage in the progress section */}
            <img src={avatarImage} alt="User avatar" className="rounded-full w-12 h-12" />
            <div className="flex-1 mx-4">
              <div className="relative w-full h-4 bg-gray-200 rounded-full">
                <div className="absolute top-0 left-0 h-4 bg-blue-500 rounded-full" style={{ width: '10%' }}></div>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>200</span>
                <span>2,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Upload Section */}
        <div className="mt-4 flex flex-col items-center">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <img
              id="upload-avatar"
              src={uploadedImage || avatarImage}
              alt="Upload avatar"
              className="rounded-full w-24 h-24 bg-gray-200 flex items-center justify-center"
            />
          </label>
          <input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarUpload} />
        </div>

        {/* Form Fields */}
        <div className="mt-4">
          <label className="block">Tên hiển thị:</label>
          <input 
            type="text" 
            className="w-full border rounded-lg p-2 mt-1" 
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Email:</label>
          <input 
            type="email" 
            className="w-full border rounded-lg p-2 mt-1" 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Giới tính:</label>
          <input 
            type="text" 
            className="w-full border rounded-lg p-2 mt-1" 
            value={newGender}
            onChange={(e) => setNewGender(e.target.value)}
          />
        </div>
        <button className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg" onClick={handleSaveChanges}>Lưu thay đổi</button>

        {/* Achievement Badges */}
        <div className="mt-4">
          <span>KHUNG CÁC THÀNH TÍCH:</span>
          <div className="flex justify-between mt-2 space-x-2">
            {[
              { level: "VIP 1", border: "blue-300" },
              { level: "VIP 2", border: "green-300" },
              { level: "VIP 3", border: "yellow-300" },
              { level: "VIP 4", border: "orange-300" },
              { level: "VIP 5", border: "red-300" },
            ].map((vip, index) => (
              <div key={index} className={`rounded-full border-2 border-${vip.border} p-1`}>
                <img src={avatarImage} alt={`${vip.level} badge`} className="w-12 h-12 rounded-full" />
                <p className="text-center mt-1 text-sm">{vip.level}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UserStickyNote />
    </div>
  );
}
