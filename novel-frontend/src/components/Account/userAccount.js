import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext'; // Import UserContext/ Import UserNotification component
import axios from 'axios'; // Import axios
import {fetchReaderExp} from '../../services/apiService';
import { registerAsAuthor, checkAuthorRequestStatus  } from '../../services/apiService'; //đăng ký tác giả
import { createMomoPayment, createTransaction } from '../../services/apiService'; // Import API thanh toán MoMo
import { updateWallet, getWallet } from '../../services/apiService'; //Cập nhật Coin
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import jwt_decode from 'jwt-decode';

export default function UserAccount() {
  const { setLoggedInUser: updateGlobalUser, isDarkMode } = useContext(UserContext); // Access context to update global user and dark mode state
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [avatarImage, setAvatarImage] = useState("https://via.placeholder.com/150");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [notification, setNotification] = useState(null);
  const [showAuthorRequestPopup, setShowAuthorRequestPopup] = useState(false);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState("VIP 0");
  const [showCoinRechargePopup, setShowCoinRechargePopup] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState('momo'); // 'momo', 'card', 'bank'
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // Trạng thái lưu link QR
  const [spendingWallet, setSpendingWallet] = useState(0);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const coinPackages = [
    { id: 1, coins: 4, price: 20000, bonus: 0 },
    { id: 2, coins: 10, price: 50000, bonus: 1 },
    { id: 3, coins: 20, price: 100000, bonus: 3 },
    { id: 4, coins: 50, price: 250000, bonus: 10 },
    { id: 5, coins: 100, price: 500000, bonus: 25 },
    { id: 6, coins: 200, price: 1000000, bonus: 60 }
  ];

  const paymentMethods = [
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: '💜',
      description: 'Quét mã QR hoặc chuyển khoản qua MoMo',
      qrCode: 'https://imgur.com/S4OTTI1.jpg', // Replace with actual QR code
      accountNumber: '0987654321',
      accountName: 'NOVEL WEBSITE'
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        console.error('Không tìm thấy token. Vui lòng đăng nhập.');
        return;
      }
  
      try {
        // Lấy thông tin người dùng
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data;
  
        if (user && user._id) {
          setLoggedInUser(user);
          setAvatarImage(user.avatar || "https://via.placeholder.com/150");
          setNewDisplayName(user.username);
          setNewEmail(user.email);
          setNewGender(user.gender || "other");
          setNewFullName(user.fullname || "");
  
          // Lấy dữ liệu ví từ API
          const walletData = await getWallet(user._id, token);
          console.log('Wallet data:', walletData); // Log dữ liệu ví để kiểm tra
          if (walletData) {
            setSpendingWallet(walletData.wallet.balance || 0); // Cập nhật state
          } else {
            console.error('Không có dữ liệu ví!');
          }
  
          // Lấy dữ liệu EXP
          const expData = await fetchReaderExp(user._id);
          console.log("expData", expData); // Log dữ liệu EXP để kiểm tra
          
          if (expData) {
            setExp(expData.totalExp);
            setLevel(expData.idLevel?.title || "Chưa có cấp độ");
          }
        } else {
          console.error('Dữ liệu người dùng không đầy đủ hoặc thiếu _id.');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Token không hợp lệ hoặc đã hết hạn.');
        } else {
          console.error('Lỗi khi lấy thông tin người dùng hoặc ví:', error);
        }
      }
    };
  
    fetchUserData();
  }, []);  

  //Xử lý thanh toán momo
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  // 2. Tạo thanh toán
  const handleCreateMomoPayment = async () => {
    if (!selectedPackage) {
      alert('Vui lòng chọn gói nạp!');
      return;
    }
  
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập!');
      return;
    }
  
    try {
      // Dữ liệu thanh toán MoMo
      const paymentData = {
        amount: selectedPackage.price,
        orderInfo: `Nạp ${selectedPackage.coins} coin cho user ${loggedInUser.fullname}`,
        idUser: loggedInUser._id,
        bonus: selectedPackage.bonus,
      };    
  
      // Gọi API MoMo để tạo thanh toán
      const result = await createMomoPayment(paymentData, token);
      console.log('MoMo payment result:', result);
  
      if (result && result.deeplink) {
        console.log('Deeplink:', result.deeplink); // In deeplink ra để kiểm tra
      
        // Kiểm tra nếu deeplink là một đối tượng và lấy đúng URL
        const deeplinkUrl = result.deeplink && typeof result.deeplink === 'object' ? result.deeplink.payUrl : result.deeplink;
  
          window.location.href = deeplinkUrl;
        
        // Gửi yêu cầu tạo giao dịch vào server của bạn sau khi thanh toán
        const transactionData = {
          amount: selectedPackage.price,
          orderInfo: paymentData.orderInfo,
          idUser: loggedInUser._id,
          orderId: result.deeplink.orderId,
        };       
        if (!transactionData.orderId) {
          alert('Lỗi: Không nhận được orderId từ MoMo.');
          return;
        }
  
        // Gọi API để tạo giao dịch
        const transactionResult = await createTransaction(transactionData, token);
  
        // Sau khi thanh toán thành công, bạn có thể cập nhật giao dịch là 'completed' từ callback hoặc webhook.
      } else {
        console.error('Không nhận được deeplink từ MoMo:', result);
        alert('Không nhận được link thanh toán. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán MoMo:', error);
      alert('Tạo thanh toán thất bại.');
    }
  };    

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Cập nhật ngay avatarImage trong state để giao diện thay đổi ngay lập tức
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarImage(reader.result);  // Cập nhật ảnh được chọn từ file
    };
    reader.readAsDataURL(file);
  };
  
  const uploadImageToCloudinary = async (file) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in.');
      return null;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'user-avatar');
    formData.append('cloud_name', 'dq7xydlgs');
    formData.append('folder', 'user_avatar');
  
    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dq7xydlgs/image/upload', formData);
      console.log('Cloudinary Response:', response.data); // Log response data
      return response.data.secure_url;  // Return image URL
    } catch (error) {
      console.error('Error uploading image to Cloudinary: ', error);
      return null;
    }
  };

  const updateUserInBackend = async (updatedUser) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${updatedUser._id}`, updatedUser, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User updated successfully:', response.data); // Log to verify update
    } catch (error) {
      console.error('Error updating user in backend: ', error);
    }
  };
  

  const handleSaveChanges = async () => {
    try {
      let updatedAvatar = avatarImage;
  
      // Nếu ảnh mới được chọn (base64), upload lên Cloudinary
      if (avatarImage !== loggedInUser.avatar && avatarImage.startsWith("data:image")) {
        const uploadedImageUrl = await uploadImageToCloudinary(avatarImage);
        if (uploadedImageUrl) {
          updatedAvatar = uploadedImageUrl;  // Cập nhật avatar với URL mới từ Cloudinary
        } else {
          console.error('Không thể upload ảnh lên Cloudinary');
          return; // Nếu không thể upload ảnh, không tiếp tục lưu thay đổi
        }
      }
  
      // Cập nhật lại thông tin người dùng
      const updatedUser = {
        ...loggedInUser,
        username: newDisplayName,
        email: newEmail,
        gender: newGender,
        fullname: newFullName,
        avatar: updatedAvatar, // Lưu ảnh mới
      };
  
      // Lưu thông tin người dùng vào backend
      await updateUserInBackend(updatedUser);
  
      // Cập nhật lại thông tin người dùng trong state và global context
      setLoggedInUser(updatedUser);
      updateGlobalUser(updatedUser); // Cập nhật context toàn cục
  
      setNotification({ message: 'Cập nhật thành công', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Có lỗi khi lưu thay đổi', type: 'error' });
      console.error('Error saving changes:', error);
    }
  };
  
  const handleAuthorRequest = async () => {
    try {
      // 1. Kiểm tra trạng thái yêu cầu trước
      const statusData = await checkAuthorRequestStatus(loggedInUser._id);
  
      if (statusData.status === 'pending') {
        // Nếu đang chờ xét duyệt thì không gửi yêu cầu nữa
        setNotification({ message: 'Yêu cầu của bạn đang được xét duyệt.', type: 'info' });
        setShowAuthorRequestPopup(false);
        return;
      }
  
      // 2. Nếu chưa có yêu cầu, thực hiện đăng ký
      const userData = { idUser: loggedInUser._id };
      const result = await registerAsAuthor(userData);
  
      setShowAuthorRequestPopup(false);
      setNotification({ message: 'Yêu cầu của bạn đã được gửi cho admin để xét duyệt.', type: 'success' });
  
      // Không thay đổi vai trò ở đây. Chỉ thay đổi khi yêu cầu được phê duyệt
  
    } catch (error) {
      console.error('Error registering as author:', error);
      setNotification({ message: error.message || 'Đăng ký thất bại, vui lòng thử lại.', type: 'error' });
    }
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
    <div className={`flex flex-col md:flex-row p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Left Sidebar */}
      <div className={`w-full md:w-1/4 p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        <div className="flex flex-col items-center">
          {/* Avatar Image */}
          <img src={avatarImage} alt="User avatar" className="rounded-full w-24 h-24 mb-4" />
          <h2 className="text-lg font-semibold">{loggedInUser.fullName}</h2>
          <p className="text-gray-600">{loggedInUser.email}</p>
          <p className="text-gray-600">{loggedInUser.gender}</p>
        </div>
        <div className="mt-4">
        <div className="flex justify-between items-center">
          <span>Ví chi tiêu : </span>
          <span>
            {Number.isInteger(spendingWallet) 
              ? spendingWallet 
              : spendingWallet.toFixed(2)} 
            <i className="fas fa-coins text-yellow-500"> Coin✨</i>
          </span>
        </div>
        </div>
        <button
          className="mt-4 w-full py-2 rounded-lg bg-green-500 text-white"
          onClick={() => setShowCoinRechargePopup(true)}
        >
          NẠP COIN
        </button>
        {loggedInUser.role !== 'author' && (
        <button
          className={`mt-4 w-full py-2 rounded-lg ${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-black'}`}
          onClick={() => setShowAuthorRequestPopup(true)}
        >
          ĐĂNG KÝ LÀM TÁC GIẢ
        </button>
        )}
        <div className="space-y-4 mt-4">
          <ul className="space-y-2">
            <li className="flex items-center">
              <i className="fas fa-credit-card mr-2"></i> 
              <a href="#!" onClick={handleAuthorSpaceClick}>Không gian tác giả</a>
            </li>
            <li className="flex items-center">
              <i className="fas fa-heart mr-2"></i> 
              <Link to="/favorites">Yêu thích</Link>
            </li>
           
         
            <li className="flex items-center">
              <i className="fas fa-history mr-2"></i> 
              <Link to="/history">Lịch sử đọc</Link>
            </li>
            <li className="flex items-center">
              <i className="fas fa-receipt mr-2"></i> 
              <Link to="/payment">Lịch sử thanh toán</Link>
            </li>
            <li className="flex items-center">
              <i className="fas fa-receipt mr-2"></i> 
              <Link to="/unlockedNovels">Chương đã mở khóa</Link>
            </li>
            <li className="flex items-center">
              <i className="fas fa-key mr-2"></i> 
              <a href="#!">Đổi mật khẩu</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className={`w-full md:w-3/4 p-4 rounded-lg shadow-md mt-4 md:mt-0 md:ml-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        {/* Premium Package Section */}
       

        {/* Current Level Section */}
        <div className="mt-4">
          <span>Cấp độ hiện tại: {level}</span>
          <div className="flex items-center mt-2">
            <img src={avatarImage} alt="User avatar" className="rounded-full w-12 h-12" />
            <div className="flex-1 mx-4">
              <div className="relative w-full h-4 bg-gray-200 rounded-full">
                <div
                  className="absolute top-0 left-0 h-4 bg-blue-500 rounded-full"
                  style={{ width: `${(exp / 10000) * 100}%` }}  // Dùng exp để tính tiến độ
                ></div>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>{exp}</span>  {/* Số điểm kinh nghiệm hiện tại */}
                <span>10,000</span>  {/* Tổng điểm kinh nghiệm yêu cầu để lên cấp */}
              </div>
            </div>
          </div>
        </div>


        {/* Avatar Upload Section */}
        <div className="mt-4 flex flex-col items-center">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <img
              id="upload-avatar"
              src={avatarImage} // Hiển thị ảnh mới nếu có, nếu không thì ảnh cũ
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
            className={`w-full border rounded-lg p-2 mt-1 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`} 
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Username:</label>
          <input 
            type="text" 
            className={`w-full border rounded-lg p-2 mt-1 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`} 
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Email:</label>
          <input 
            type="email" 
            className={`w-full border rounded-lg p-2 mt-1 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`} 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block">Giới tính:</label>
          <select
            className={`w-full border rounded-lg p-2 mt-1 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
            value={newGender}
            onChange={(e) => setNewGender(e.target.value)}
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <button
          className="mt-4 w-full py-2 rounded-lg bg-red-500 text-white"
          onClick={handleSaveChanges} // Không cần truyền đối số nữa
        >
          Lưu thay đổi
        </button>

  
      </div>

      {/* Notification Popup */}
      {notification && (
        <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'}`}>
          <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Thông báo</h2>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{notification.message}</p>
            <button
              className={`w-full py-2 px-4 rounded-lg ${
                notification.type === 'success'
                  ? isDarkMode
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                  : isDarkMode 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              onClick={() => setNotification(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Author Request Popup */}
      {showAuthorRequestPopup && (
        <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'}`}>
          <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Yêu cầu làm tác giả</h2>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Bạn có chắc chắn muốn gửi yêu cầu làm tác giả không?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
                onClick={() => setShowAuthorRequestPopup(false)}
              >
                Hủy
              </button>
              <button 
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
                onClick={handleAuthorRequest}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coin Recharge Popup */}
      {showCoinRechargePopup && (
        <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'}`}>
        <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} w-[90%] max-w-lg`}>
          <div className="flex justify-between items-center mb-3">
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Nạp Coin</h2>
              <button
                onClick={() => setShowCoinRechargePopup(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ✕
              </button>
            </div>

            {/* Package Selection */}
            {/* Chọn gói coin */}
            <div className="mb-3">
              <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Chọn gói Coin</h3>
              <div className="grid grid-cols-3 gap-2">
                {coinPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-2 rounded-lg border cursor-pointer transition-all ${selectedPackage?.id === pkg.id ? 'border-green-500 bg-green-50 text-black' : 'border-gray-300 hover:border-green-500'}`}
                    onClick={() => handlePackageSelect(pkg)} // Chọn gói khi click
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-500">{pkg.coins}</div>
                      <div className="text-xs text-gray-600">Coin</div>
                      <div className="text-sm font-semibold">{pkg.price.toLocaleString()}đ</div>
                      {pkg.bonus > 0 && (
                        <div className="text-xs text-green-500">+{pkg.bonus}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hiển thị QR Code nếu có */}
            {qrCodeUrl && (
              <div className="flex justify-center mt-4">
                <div className="p-2 bg-white rounded-lg">
                <QRCodeSVG
                  value={qrCodeUrl}  // URL tạo từ API MoMo
                  size={200}         // Kích thước QR code
                  fgColor="#000000"  // Màu của QR code
                  bgColor="#ffffff"  // Màu nền của QR code
                />
                </div>
              </div>
            )}

            {/* Button thanh toán MoMo */}
            <button onClick={handleCreateMomoPayment} className="btn btn-primary mt-4">
              Thanh toán MoMo
            </button>

            {/* Payment Methods Tabs */}
            <div className="mb-3">
              <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Phương thức thanh toán</h3>
              <div className="flex space-x-1 mb-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className={`flex items-center px-2 py-1 rounded text-sm ${
                      activePaymentMethod === method.id
                        ? isDarkMode
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-green-500 text-white hover:bg-green-600'
                        : isDarkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                    onClick={() => setActivePaymentMethod(method.id)}
                  >
                    <span className="mr-1">{method.icon}</span>
                    {method.name}
                  </button>
                ))}
              </div>

              {/* Payment Method Content */}
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}>
                {activePaymentMethod === 'momo' && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <img
                        src={paymentMethods[0].qrCode}
                        alt="MoMo QR Code"
                        className="w-32 h-32"
                      />
                    </div>
                    <div className="text-sm">
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Thông tin chuyển khoản:</p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Số tài khoản: {paymentMethods[0].accountNumber}</p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Tên tài khoản: {paymentMethods[0].accountName}</p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Lưu ý: NOVEL [Số điện thoại]
                      </p>
                    </div>
                  </div>
                )}

                {activePaymentMethod === 'card' && (
                  <div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {paymentMethods[1].cardTypes.map((type) => (
                        <div
                          key={type}
                          className={`p-2 border rounded-lg cursor-pointer ${
                            isDarkMode 
                              ? 'border-gray-600 hover:border-green-500 bg-gray-700' 
                              : 'border-gray-300 hover:border-green-500 bg-white'
                          }`}
                        >
                          <div className="text-center">
                            <span className="text-lg">📱</span>
                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nhập mã thẻ"
                        className={`w-full p-2 text-sm rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-black placeholder-gray-500'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Nhập seri thẻ"
                        className={`w-full p-2 text-sm rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-black placeholder-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {activePaymentMethod === 'bank' && (
                  <div className="space-y-2">
                    {paymentMethods[2].banks.map((bank) => (
                      <div
                        key={bank.name}
                        className={`p-2 border rounded-lg text-sm ${
                          isDarkMode 
                            ? 'border-gray-600 bg-gray-700' 
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{bank.name}</p>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Số TK: {bank.number}</p>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Chủ TK: {bank.name}</p>
                          </div>
                          <button
                            className={`px-2 py-1 rounded text-sm ${
                              isDarkMode 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                            onClick={() => {
                              navigator.clipboard.writeText(bank.number);
                              setNotification({
                                message: 'Đã sao chép số tài khoản',
                                type: 'success'
                              });
                            }}
                          >
                            Sao chép
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                className={`px-3 py-1 rounded text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
                onClick={() => setShowCoinRechargePopup(false)}
              >
                Hủy
              </button>
              <button
                className={`px-3 py-1 rounded text-sm ${
                  isDarkMode 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                } ${!selectedPackage ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!selectedPackage}
                onClick={async () => {
                  setShowCoinRechargePopup(false);
                  await handleCreateMomoPayment(); // Gọi thanh toán Momo luôn
                }}                
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
