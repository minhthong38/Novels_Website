import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Ensure this import is correct and not causing a loop

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Add success state
  const [isLoading, setIsLoading] = useState(false);
  const { setLoggedInUser } = useContext(UserContext); // Access setLoggedInUser from context
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Server response:', data); // Debugging log

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      if (!data.user || !data.token) { // Ensure both user and token exist
        console.error('Invalid server response:', data);
        throw new Error('Dữ liệu người dùng không hợp lệ từ server!');
      }

      // Store token if it exists
      if (data.token) {
        if (rememberMe) {
          localStorage.setItem('token', data.token);
        } else {
          sessionStorage.setItem('token', data.token);
        }
      }

      // Store email and password if "Nhớ mật khẩu" is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      // Store user data, including full name, avatar, and gender
      const userWithDetails = { 
        ...data.user, 
        avatar: data.user.avatar || 'https://via.placeholder.com/150', 
        fullName: data.user.fullName || data.user.username,
        gender: data.user.gender || 'other'
      };
      localStorage.setItem('user', JSON.stringify(userWithDetails));

      // Update context
      setLoggedInUser(userWithDetails);

      setSuccess('Đăng nhập thành công!');

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Lỗi:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email and password on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  return (
    <div
      className="flex flex-col items-center p-20"
      style={{
        background: 'linear-gradient(270deg, #d1c4e9, #b3e5fc, #c8e6c9, #ffe0b2, #ffccbc, #d7ccc8)',
        backgroundSize: '400% 400%',
        animation: 'pastel-dark 5s linear infinite',
        minHeight: '100vh',
      }}
    >
      <div className="border border-black p-11 m-12 rounded-lg w-full max-w-md bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block">Email:</label>
            <input 
              type="email" 
              className="w-full border rounded-lg p-2 mt-1" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block">Mật khẩu:</label>
            <input 
              type="password" 
              className="w-full border rounded-lg p-2 mt-1" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="col-span-2 flex items-center">
            <input 
              type="checkbox" 
              className="mr-2" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label>Nhớ mật khẩu</label>
          </div>
          <div className="col-span-2">
            <button 
              className="w-full bg-black text-white py-2 rounded-lg" 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-4">{success}</p>} {/* Display success message */}
      </div>
    </div>
  );
}

// Add this CSS animation globally or in a CSS file
// @keyframes pastel-dark {
//   0% { background-position: 0% 50%; }
//   100% { background-position: 100% 50%; }
// }
