import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../data/data';
import { fetchUserDetails, fetchNovels } from '../services/apiService'; // Import fetchNovels API function
import { UserContext } from '../context/UserContext'; // Import UserContext

function Header() {
  const { loggedInUser, setLoggedInUser, isDarkMode, toggleDarkMode } = useContext(UserContext); // Get loggedInUser from context
  const [activeTab, setActiveTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

    // Log loggedInUser mỗi khi nó thay đổi
    useEffect(() => {
      console.log(loggedInUser); // Kiểm tra loggedInUser sau khi set
    }, [loggedInUser]); // Trigger lại khi loggedInUser thay đổi

  const handleSearchChange = async (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    if (keyword.length > 0) {
      try {
        const results = await fetchNovels(); // Fetch novels from API
        const filteredResults = results.filter((novel) =>
          novel.Title.toLowerCase().includes(keyword.toLowerCase())
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error fetching novels:', error);
        setSearchResults([]);
      }
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

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      fetchUserDetails(token)
        .then((data) => {
          if (data && data._id) {
            setLoggedInUser(data); // Set user data
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [setLoggedInUser]); // Ensure the header updates when the global user changes

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
    { label: 'Blind Book', href: '/blindbook' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setLoggedInUser(null);
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <header className={`shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/">
          <img src="https://imgur.com/pc05sxO.png/" alt="Logo" className="w-32 h-12" />
        </Link>
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
                className={`${isDarkMode ? 'text-white' : 'text-black'} hover:text-blue-500`}
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
          <button className={`${isDarkMode ? 'text-white' : 'text-black'}`}>🔍</button>
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
          <div className="ml-4 pl-10">
            <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" id="darkModeToggle" className="sr-only" checked={isDarkMode} onChange={toggleDarkMode} />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isDarkMode ? 'translate-x-full' : ''}`}></div>
              </div>
              <div className={`ml-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</div>
            </label>
          </div>
          <div className="relative group ml-10 pl-10">
  <div className="flex items-center space-x-2 cursor-pointer">
    <Link to="/login" className={`${isDarkMode ? 'text-white' : 'text-black'} focus:outline-none`}>
      <img   src={loggedInUser && loggedInUser.avatar  ? loggedInUser.avatar : "https://i.imgur.com/Y0N4tO3.png"} alt="User Icon" className="w-6 h-6 rounded-full" />
    </Link>
    {loggedInUser && <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>{loggedInUser.fullName || loggedInUser.username}</span>} 
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
        <Link to="/userAccount" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">User Profile</Link> {/* Added User Profile link */}
        <Link to="/history" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">History</Link>
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
