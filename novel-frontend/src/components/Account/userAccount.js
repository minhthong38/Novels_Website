import React, { useState, useEffect } from 'react';
import { fetchUserDetails } from '../../services/apiService'; // Import fetchUserDetails
import { users } from '../../data/data'; // Import users data
import UserNotification from '../notifications/UserNotification'; // Import UserNotification component

export default function UserAccount() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [avatarImage, setAvatarImage] = useState("https://via.placeholder.com/150");
  const [displayName, setDisplayName] = useState("Nguyễn Văn A");
  const [email, setEmail] = useState("nguyenvana@gmail.com");
  const [gender, setGender] = useState("Nam");
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [newEmail, setNewEmail] = useState(email);
  const [newGender, setNewGender] = useState(gender);
  const [showAuthorRequestPopup, setShowAuthorRequestPopup] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newFullName, setNewFullName] = useState(''); // Add newFullName state

useEffect(() => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    fetchUserDetails(token)
      .then((data) => {
        if (data && data.id) {
          setLoggedInUser(data); // Set user data
          setAvatarImage(data.img);
          setDisplayName(data.fullName || data.username); // Use fullName as displayName
          setEmail(data.email);
          setGender(data.gender);
          setNewDisplayName(data.username);
          setNewEmail(data.email);
          setNewGender(data.gender);
          setNewFullName(data.fullName); // Initialize newFullName
          const storedNotification = localStorage.getItem(`notification_${data.id}`);
          if (storedNotification) {
            setNotification(JSON.parse(storedNotification));
            localStorage.removeItem(`notification_${data.id}`);
          }
        }
      })
      .catch((error) => console.error('Error fetching user data:', error));
  } else {
    console.error('No token found. Please log in.');
  }
}, []); // Only run once when component mounts


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
      img: uploadedImage || avatarImage, // Update the img field with the uploaded image
      fullName: newFullName, // Update fullName
      username: newDisplayName,
      email: newEmail,
      gender: newGender
    };
    setLoggedInUser(updatedUser); // Update the loggedInUser state
    setAvatarImage(updatedUser.img); // Update the avatar image in the UI
    setDisplayName(updatedUser.fullName); // Update displayName with fullName
    setEmail(updatedUser.email);
    setGender(updatedUser.gender);
    setUploadedImage(null); // Clear the uploaded image
  };

  const handleAuthorRequest = () => {
    const updatedUser = {
      ...loggedInUser,
      authorRequest: true // Add author request flag
    };
    setLoggedInUser(updatedUser);
    const userIndex = users.findIndex(user => user.id === loggedInUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
    }
    setShowAuthorRequestPopup(false);
    alert('Yêu cầu làm tác giả đã được gửi.');
  };

  const handleAuthorSpaceClick = () => {
    if (loggedInUser.role === 'author') {
      window.location.href = '/authorAccounts';
    } else {
      alert('Tài khoản của bạn chưa có vai trò tác giả.');
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để xem thông tin tài khoản.</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row p-4`}>
      {/* Left Sidebar */}
      <div className={`w-full md:w-1/4 p-4 rounded-lg shadow-md`}>
        <div className="flex flex-col items-center">
          {/* Avatar Image */}
          <img src={avatarImage} alt="User avatar" className="rounded-full w-24 h-24 mb-4" />
          <h2 className="text-lg font-semibold">{loggedInUser.fullName || loggedInUser.username}</h2> {/* Display fullName */}
          <p className="text-gray-600">{loggedInUser.username}</p> {/* Display username */}
          <p className="text-gray-600">{email}</p> {/* Display email */}
          <button className="mt-4 text-red-500">Hồ sơ cá nhân</button>
          <button className="mt-2 text-blue-500">Đăng xuất/Thoát</button>
          <button className="mt-2 text-green-500" onClick={() => setShowAuthorRequestPopup(true)}>Tham gia vai trò tác giả</button> {/* New button */}
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
          <li className="flex items-center"><i className="fas fa-credit-card mr-2"></i> <a href="#!" onClick={handleAuthorSpaceClick}>Không gian tác giả</a></li> {/* Changed section */}
          <li className="flex items-center"><i className="fas fa-heart mr-2"></i> <a href="#!">Yêu thích</a></li>
          <li className="flex items-center"><i className="fas fa-book mr-2"></i> <a href="#!">Truyện đã mở khóa</a></li>
          <li className="flex items-center"><i className="fas fa-bell mr-2"></i> <a href="#!" onClick={() => setNotification(null)}>Thông báo</a></li>
          <li className="flex items-center"><i className="fas fa-history mr-2"></i> <a href="/history">Lịch sử đọc</a></li>
          <li className="flex items-center"><i className="fas fa-receipt mr-2"></i> <a href="#!">Lịch sử thanh toán</a></li>
          <li className="flex items-center"><i className="fas fa-key mr-2"></i> <a href="#!">Đổi mật khẩu</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`w-full md:w-3/4 p-4 rounded-lg shadow-md mt-4 md:mt-0 md:ml-4`}>
        {/* Premium Package Section */}
       

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
          <label className="block">Họ và Tên:</label> {/* Move fullName input above username */}
          <input 
            type="text" 
            className={`w-full border rounded-lg p-2 mt-1`} 
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Username:</label>
          <input 
            type="text" 
            className={`w-full border rounded-lg p-2 mt-1`} 
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Email:</label>
          <input 
            type="email" 
            className={`w-full border rounded-lg p-2 mt-1`} 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Giới tính:</label>
          <select
            className={`w-full border rounded-lg p-2 mt-1`}
            value={newGender}
            onChange={(e) => setNewGender(e.target.value)}
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
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

      {/* Notification Popup */}
      {notification && (
        <UserNotification notification={notification} onClose={() => setNotification(null)} />
      )}

      {/* Author Request Popup */}
      {showAuthorRequestPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Yêu cầu làm tác giả</h2>
            <p>Bạn có chắc chắn muốn gửi yêu cầu làm tác giả không?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
                onClick={() => setShowAuthorRequestPopup(false)}
              >
                Hủy
              </button>
              <button 
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                onClick={handleAuthorRequest}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <UserStickyNote /> */}
    </div>
  );
}
