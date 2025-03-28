import React, { useState, useContext } from 'react';
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
    setSuccess(''); // Clear success message

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      if (!data.token || !data.user) {
        throw new Error('Dữ liệu không hợp lệ từ server!');
      }

      // Save token to localStorage or sessionStorage
      if (rememberMe) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }

      // Save user data to localStorage for Header to access
      localStorage.setItem('user', JSON.stringify(data.user));

      // Update the logged-in user in the context
      setLoggedInUser(data.user);

      // Show success message
      setSuccess('Đăng nhập thành công!');

      // Redirect to the homepage after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error("Lỗi:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-20">
      <div className="border p-4 rounded-lg w-full max-w-md" style={{ backgroundImage: 'url(https://media.istockphoto.com/id/1459373176/vi/vec-to/n%E1%BB%81n-b%E1%BB%8B-m%E1%BA%A5t-n%C3%A9t-tr%E1%BB%ABu-t%C6%B0%E1%BB%A3ng-m%C3%B9a-xu%C3%A2n-m%C3%B9a-h%C3%A8-bi%E1%BB%83n.jpg?s=612x612&w=0&k=20&c=7qcezfnEnWLDiqaxq5ahyhNl6zTCLZbNQ9wQjeRT7F0=)', backgroundSize: 'cover' }}>
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
