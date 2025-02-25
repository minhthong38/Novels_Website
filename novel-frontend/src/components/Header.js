import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { categories, novels } from '../data/data';
import { UserContext } from '../context/UserContext';

function Header() {
  const { loggedInUser, logout } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    if (keyword.length > 0) {
      const results = novels.filter(novel => 
        novel.Title.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tabs = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Mới Cập Nhật', href: '/update' },
    { 
      label: 'Thể Loại', 
      options: categories.map(category => ({
        name: category.name,
        href: `/menu/${category.id}`
      }))
    },
    { 
      label: 'Tác Giả', 
      options: [
        { name: 'Rosie Nguyễn', href: '/authors' },
      ] 
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-xl font-bold">LOGO NÈ</div>
        <nav className="flex space-x-4">
          {tabs.map((tab, index) => (
            <div 
              key={index} 
              className="relative group"
              onMouseEnter={() => setActiveTab(tab.options ? index : null)}
              onMouseLeave={() => setActiveTab(null)}
            >
              <Link 
                to={tab.href || '#'} 
                className="text-gray-700 hover:text-blue-500"
              >
                {tab.label}
              </Link>
              {tab.options && activeTab === index && (
                <div className="absolute bg-white border rounded shadow-lg left-0 top-full z-10 w-48">
                  {tab.options.map((option, idx) => (
                    <Link 
                      key={idx} 
                      to={option.href} 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {option.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center space-x-2 relative" ref={searchRef}>
          <input 
            type="text" 
            placeholder="Tìm kiếm" 
            className="border rounded px-2 py-1" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="text-gray-700">🔍</button>
          {searchResults.length > 0 && (
            <div className="absolute bg-white border rounded shadow-lg left-0 top-full z-10 w-48 mt-2">
              {searchResults.map((novel, index) => (
                <Link 
                  key={index} 
                  to={`/novelDetail/${novel.NovelID}`} 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <img src={novel.ImageUrl} alt={novel.Title} className="w-8 h-10 mr-2" />
                  {novel.Title}
                </Link>
              ))}
            </div>
          )}
          <div className="relative group ml-4">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Link to="/userAccount" className="text-gray-700 focus:outline-none">
                <img src={loggedInUser ? loggedInUser.avatar : "https://i.imgur.com/Y0N4tO3.png"} alt="User Icon" className="w-6 h-6 rounded-full" />
              </Link>
              {loggedInUser && <span className="ml-2">{loggedInUser.username}</span>}
            </div>
            <div className="absolute bg-white border rounded shadow-lg right-0 top-full z-10 w-48 hidden group-hover:block">
              {loggedInUser ? (
                <>
                  {loggedInUser.role === 'user' && (
                    <Link to="/userAccount" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">User Profile</Link>
                  )}
                  {loggedInUser.role === 'author' && (
                    <Link to="/authorAccounts" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Author Profile</Link>
                  )}
                  {loggedInUser.role === 'admin' && (
                    <Link to="/adminAccount" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Admin Profile</Link>
                  )}
                  <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Register</Link>
                  <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
