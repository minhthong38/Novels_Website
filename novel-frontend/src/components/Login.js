import React, { useState, useContext } from 'react';
import { users } from '../data/data';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const { setLoggedInUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const user = users.find(user => user.username === username);

    if (!user) {
      setError('Tên đăng nhập không tồn tại');
      return;
    }

    if (user.password !== password) {
      setError('Mật khẩu không đúng');
      return;
    }

    setError('');
    setLoggedInUser(user);
  };

  return (
    <div className="flex flex-col items-center p-20">
      <div className="border p-4 rounded-lg w-full max-w-md" style={{ backgroundImage: 'url(https://media.istockphoto.com/id/1459373176/vi/vec-to/n%E1%BB%81n-b%E1%BB%8B-m%E1%BA%A5t-n%C3%A9t-tr%E1%BB%ABu-t%C6%B0%E1%BB%A3ng-m%C3%B9a-xu%C3%A2n-m%C3%B9a-h%C3%A8-bi%E1%BB%83n.jpg?s=612x612&w=0&k=20&c=7qcezfnEnWLDiqaxq5ahyhNl6zTCLZbNQ9wQjeRT7F0=)', backgroundSize: 'cover' }}>
        <h1 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block">Tên đăng nhập:</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-2 mt-1" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            >
              Đăng nhập
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}
