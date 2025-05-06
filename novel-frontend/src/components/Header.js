import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserDetails, fetchNovels, fetchCategories } from '../services/apiService'; // Import fetchNovels and fetchCategories API functions
import { UserContext } from '../context/UserContext'; // Import UserContext

function Header() {
  const { loggedInUser, setLoggedInUser, isDarkMode, toggleDarkMode } = useContext(UserContext); // Get loggedInUser from context
  const [activeTab, setActiveTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categoryList, setCategoryList] = useState([]); // State for categoryList fetched from API
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility
  const [activeDropdown, setActiveDropdown] = useState(null); // State to manage dropdown visibility
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State to toggle user menu visibility
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const menuRef = useRef(null); // Ref for the responsive menu
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
          novel.title.toLowerCase().includes(keyword.toLowerCase()) // Ensure property name matches API response
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error fetching novels:', error);
        setSearchResults([]); // Clear results on error
      }
    } else {
      setSearchResults([]); // Clear results if search term is empty
    }
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchResults([]);
    }
  };

  const handleClickOutsideMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false); // Close the menu if clicked outside
    }
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleClickOutsideUserMenu = (event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setIsUserMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideUserMenu);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideUserMenu);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
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

  useEffect(() => {
    // Fetch categoryList from the correct API endpoint
    fetchCategories()
      .then((data) => {
        if (Array.isArray(data)) {
          setCategoryList(data); // Set the fetched categories
        }
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const tabs = [
    { label: 'Trang Chủ', href: '/', onClick: () => navigate('/') },
    { label: 'Mới Cập Nhật', href: '/update', onClick: () => navigate('/update') },
    {
      label: 'Thể Loại',
      options: Array.isArray(categoryList) && categoryList.length > 0
        ? categoryList.map((category) => ({
            name: category.titleCategory, // Use titleCategory from API
            href: `/menu/${category._id}`, // Use _id from API to link to the menu
            onClick: () => navigate(`/menu/${category._id}`),
          }))
        : [] // Show nothing if categoryList is empty
    },
    { label: 'Blind Book', href: '/blindbook', onClick: () => navigate('/blindbook') }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setLoggedInUser(null);
    navigate('/'); // Redirect to home page after logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index); // Toggle dropdown visibility
  };

  return (
    <header className={`shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative z-50`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Responsive Menu Button */}
        <button 
          className={`lg:hidden text-xl ${isDarkMode ? 'text-white' : 'text-black'}`} // Apply darkMode styles
          onClick={toggleMenu}
        >
          ☰
        </button>
        {/* Centered Logo */}
        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
          <img src="https://imgur.com/pc05sxO.png/" alt="Logo" className="w-32 h-12" />
        </Link>
        {/* User Icon and Dark Mode Toggle for Small Screens */}
        <div className="flex items-center space-x-4 lg:hidden">
          <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                id="darkModeToggle" 
                className="sr-only" 
                checked={isDarkMode} 
                onChange={toggleDarkMode} 
              />
              <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
              <div 
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${isDarkMode ? 'translate-x-full' : ''}`}
              ></div>
            </div>
          </label>
          <div className="relative" ref={userMenuRef}>
            <button onClick={handleUserMenuToggle} className="focus:outline-none">
              <img 
                src={loggedInUser && loggedInUser.avatar ? loggedInUser.avatar : "https://i.imgur.com/Y0N4tO3.png"} 
                alt="User Icon" 
                className="w-6 h-6 rounded-full"
              />
            </button>
            {isUserMenuOpen && (
              <div className={`absolute right-0 mt-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} border rounded shadow-lg z-10 w-48`}>
                {loggedInUser ? (
                  <>
                    <Link to="/userAccount" className="block px-4 py-2 hover:bg-gray-600">User Profile</Link>
                    {loggedInUser.role === 'author' && (
                      <Link to="/authorAccounts" className="block px-4 py-2 hover:bg-gray-600">Author Profile</Link>
                    )}
                    <Link to="/history" className="block px-4 py-2 hover:bg-gray-600">History</Link>
                    {/* <Link to="/settings" className="block px-4 py-2 hover:bg-gray-600">Settings</Link> */}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-600">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="block px-4 py-2 hover:bg-gray-600">Register</Link>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-600">Login</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Navigation Tabs */}
        <nav className="hidden lg:flex space-x-4">
          {tabs.map((tab, index) => (
            <div 
              key={index} 
              className="relative group"
              onMouseEnter={() => tab.options && setActiveDropdown(index)}
              onMouseLeave={() => tab.options && setActiveDropdown(null)}
            >
              <button 
                onClick={tab.onClick} 
                className={`${isDarkMode ? 'text-white' : 'text-black'} hover:text-blue-500`}
              >
                {tab.label}
              </button>
              {tab.options && activeDropdown === index && (
                <div className={`absolute ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} border rounded shadow-lg left-0 top-full z-10 w-48`}>
                  {tab.options.map((option, idx) => (
                    <button 
                      key={idx} 
                      onClick={option.onClick} 
                      className="block px-4 py-2 hover:bg-gray-600"
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        {/* Responsive Navigation */}
        <nav 
          ref={menuRef} // Attach the ref to the responsive menu
          className={`fixed lg:hidden top-0 left-0 h-full w-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} shadow-lg transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform z-50`}
        >
          {/* Close Button for Responsive Menu */}
          <button 
            className={`absolute top-4 right-4 text-xl z-50 ${isDarkMode ? 'text-white' : 'text-black'}`} // Apply darkMode styles
            onClick={toggleMenu}
          >
            ✕
          </button>
          {/* Logo in Responsive Menu */}
          <div className="flex justify-center mt-6">
            <Link to="/">
              <img src="https://imgur.com/pc05sxO.png/" alt="Logo" className="w-24 h-10" />
            </Link>
          </div>
          {/* Search Bar in Responsive Menu */}
          <div className="px-4 py-2">
            <input 
              type="text" 
              placeholder="Tìm kiếm" 
              className={`border rounded mt-6 px-2 py-1 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`} 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchResults.length > 0 && (
              <div className={`border rounded shadow-lg mt-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                {searchResults.map((novel, index) => (
                  <Link 
                    key={index} 
                    to={`/novelDetail/${novel._id}`} // Ensure the correct property (_id) is used for navigation
                    className="flex items-center px-4 py-2 hover:bg-gray-600"
                    onClick={() => setSearchResults([])} // Clear search results after navigation
                  >
                    <img src={novel.imageUrl} alt={novel.title} className="w-8 h-10 mr-2" />
                    {novel.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* Navigation Tabs in Responsive Menu */}
          {tabs.map((tab, index) => (
            <div key={index} className="relative">
              <button
                onClick={tab.onClick}
                className="block px-4 py-2 hover:text-blue-500"
              >
                {tab.label}
              </button>
              {tab.options && (
                <div className={`border rounded shadow-lg mt-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                  {tab.options.map((option, idx) => (
                    <button 
                      key={idx} 
                      onClick={option.onClick} 
                      className="block px-4 py-2 hover:bg-gray-600"
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        {/* Search Bar for Larger Screens */}
        <div className="hidden lg:flex items-center space-x-0 relative" ref={searchRef}>
          <input 
            type="text" 
            placeholder="Tìm kiếm" 
            className={`border rounded px-2 py-1  ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`} 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchResults.length > 0 && (
            <div className={`absolute border rounded shadow-lg left-0 top-full z-10 w-48 mt-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
              {searchResults.map((novel, index) => (
                <Link 
                  key={index} 
                  to={`/novelDetail/${novel._id}`} // Ensure the correct property (_id) is used for navigation
                  className="flex items-center px-4 py-2 hover:bg-gray-600"
                  onClick={() => setSearchResults([])} // Clear search results after navigation
                >
                  <img src={novel.imageUrl} alt={novel.title} className="w-8 h-10 mr-2" />
                  {novel.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Dark Mode Toggle and User Profile for Larger Screens */}
        <div className="hidden lg:flex items-center space-x-2 ">
          <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer m-2">
            <div className="relative">
              <input 
                type="checkbox" 
                id="darkModeToggle" 
                className="sr-only" 
                checked={isDarkMode} 
                onChange={toggleDarkMode} 
              />
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div 
                className={`dot absolute left-1 top-1  bg-white w-6 h-6 rounded-full transition ${isDarkMode ? 'translate-x-full' : ''}`}
              ></div>
            </div>
            <span className={`ml-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </label>
          <div className="relative group">
            <button className="focus:outline-none flex items-center space-x-2">
              <img 
                src={loggedInUser && loggedInUser.avatar ? loggedInUser.avatar : "https://i.imgur.com/Y0N4tO3.png"} 
                alt="User Icon" 
                className="w-6 h-6 rounded-full"
              />
              {loggedInUser && <span className={`${isDarkMode ? 'text-white' : 'text-black'}`}>{loggedInUser.fullName || loggedInUser.username}</span>}
            </button>
            <div className={`absolute border rounded shadow-lg right-0 top-full z-10 w-48 hidden group-hover:block ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
              {loggedInUser ? (
                <>
                  <Link to="/userAccount" className="block px-4 py-2 hover:bg-gray-600">User Profile</Link>
                  {loggedInUser.role === 'author' && (
                    <Link to="/authorAccounts" className="block px-4 py-2 hover:bg-gray-600">Author Profile</Link>
                  )}
                  <Link to="/history" className="block px-4 py-2 hover:bg-gray-600">History</Link>
                  {/* <Link to="/settings" className="block px-4 py-2 hover:bg-gray-600">Settings</Link> */}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/register" className="block px-4 py-2 hover:bg-gray-600">Register</Link>
                  <Link to="/login" className="block px-4 py-2 hover:bg-gray-600">Login</Link>
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
