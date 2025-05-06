import React, { useState, useEffect } from 'react';
import {checkUsernameEmail} from '../services/apiService'; // Import the API function
import axios from 'axios';

export default function Register() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [fullname, setFullName] = useState(''); // Add fullName state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailErrors, setEmailErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popupError, setPopupError] = useState('');
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (password !== confirmPassword) {
      setError('Mật khẩu không giống nhau');
      setSuccess('');
    } else if (password && confirmPassword) {
      setError('');
      setSuccess('Mật khẩu trùng khớp');
    } else {
      setError('');
      setSuccess('');
    }
  }, [password, confirmPassword]);

  const handleRegister = async () => {
    if (!fullname || !username || !password || !confirmPassword || !email || !gender) {
      setPopupError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (error || usernameError || emailErrors.length > 0) {
      return;
    }
    
  
    try {

      // Kiểm tra username và email đã tồn tại chưa
      const checkResponse = await checkUsernameEmail(username, email);
      console.log("Check response:", checkResponse); // Log the response for debugging
      
      if (checkResponse.usernameExists || checkResponse.emailExists) {
        if (checkResponse.usernameExists) {
          setUsernameError("Tên đăng nhập đã tồn tại");
        }
        if (checkResponse.emailExists) {
          setEmailErrors([ "Email đã tồn tại" ]);
        }
        setPopupError("Thông tin không hợp lệ. Vui lòng kiểm tra lại.");
        return;
      }

      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("gender", gender);
  
      // Thêm ảnh (nếu có)
      const fileInput = document.getElementById("image-upload");
      if (fileInput && fileInput.files[0]) {
        formData.append("image", fileInput.files[0]); // tên field 'image' khớp với `upload.single('image')` backend
      }
  
      const response = await axios.post("http://localhost:5000/api/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      if (response.status === 201) {
        console.log("Tài khoản đã được tạo:", response.data);
        setPopupError("");
        setRegisteredUser(response.data);
      } else {
        setPopupError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      if (error.response && error.response.status === 400) {
        const msg = error.response.data.message;
        if (msg.includes("Email")) {
          setEmailErrors([msg]);
        } else if (msg.includes("Tên đăng nhập")) {
          setUsernameError(msg);
        } else if (msg.includes("Họ và tên")) {
          setPopupError(msg); // hoặc tạo `fullnameError` nếu muốn
        } else {
          setPopupError(msg);
        }
      } else {
        setPopupError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
      }      
    }
  };
  
  
  
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (value.includes(' ')) {
      setUsernameError('Tên đăng nhập không được có dấu cách');
    } else {
      setUsernameError('');
    }
    setUsername(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const errors = [];
    if (value.includes(' ')) {
      errors.push('Email không được có dấu cách');
    }
    if (!value.includes('@')) {
      errors.push('Email phải có "@"');
    }
    if (!value.endsWith('.com')) {
      errors.push('Email phải kết thúc bằng ".com"');
    }
    setEmailErrors(errors);
    setEmail(value);
  };

  return (
    <div
      className="flex flex-col items-center p-4"
      style={{
        background: 'linear-gradient(270deg, #d1c4e9, #b3e5fc, #c8e6c9, #ffe0b2, #ffccbc, #d7ccc8)',
        backgroundSize: '400% 400%',
        animation: 'pastel-dark 5s linear infinite',
        minHeight: '100vh',
      }}
    >
      <div className="border border-black p-4 rounded-lg w-full max-w-md bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Đăng ký</h1>
        <div className="mb-4 flex flex-col items-center">
          <label className="block mb-2">Upload Avatar</label>
          <label htmlFor="image-upload" className="cursor-pointer">
            <img
              src={uploadedImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToyYhbHadbpodeEITznau3J5M6eBZVVyIDyg&s'}
              alt="Upload avatar"
              className="rounded-full w-24 h-24 bg-gray-200 flex items-center justify-center"
            />
          </label>
          <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block">Họ và Tên:</label> {/* New field */}
            <input 
              type="text" 
              className="w-full border rounded-lg p-2 mt-1" 
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block">Tên đăng nhập:</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-2 mt-1" 
              value={username}
              onChange={handleUsernameChange}
            />
            {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
          </div>
          <div className="relative">
            <label className="block">Mật khẩu:</label>
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full border rounded-lg p-2 mt-1 pr-10" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span 
              className="absolute right-2 bottom-8 cursor-pointer" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <div className="relative">
            <label className="block">Nhập lại mật khẩu:</label>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              className="w-full border rounded-lg p-2 mt-1 pr-10" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span 
              className="absolute right-2 bottom-8 cursor-pointer" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </span>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {success && <p className="text-green-500 text-sm mt-1">{success}</p>}
          </div>
          <div className="col-span-2">
            <label className="block">Email:</label>
            <input 
              type="email" 
              className="w-full border rounded-lg p-2 mt-1" 
              value={email}
              onChange={handleEmailChange}
            />
            {emailErrors.map((err, index) => (
              <p key={index} className="text-red-500 text-sm mt-1">{err}</p>
            ))}
          </div>
          <div className="col-span-2">
            <label className="block">Giới tính:</label>
            <select 
              className="w-full border rounded-lg p-2 mt-1" 
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className="col-span-2">
            <button 
              className="w-full bg-black text-white py-2 rounded-lg" 
              onClick={handleRegister}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      {popupError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-red-500">{popupError}</p>
            <button 
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setPopupError('')}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {registeredUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Đăng ký thành công!</h2>
            <p><strong>Họ và Tên:</strong> {registeredUser.fullname}</p>
            <p><strong>Tên đăng nhập:</strong> {registeredUser.username}</p>
            <p><strong>Email:</strong> {registeredUser.email}</p>
            <p><strong>Vai trò:</strong> {registeredUser.role}</p>
            <p><strong>Giới tính:</strong> {registeredUser.gender}</p>
            <img src={registeredUser.avatar} alt="Avatar" className="w-24 h-24 rounded-full mt-4" />
            <button 
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setRegisteredUser(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Add this CSS animation globally or in a CSS file
// @keyframes pastel-dark {
//   0% { background-position: 0% 50%; }
//   100% { background-position: 100% 50%; }
// }