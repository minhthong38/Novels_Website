import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'; // Chắc chắn lưu trạng thái đúng
  });
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setLoggedInUser(JSON.parse(savedUser));
      }

      // Đảm bảo class `dark` được áp dụng ngay khi load trang
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (err) {
      console.error('Error reading data from localStorage:', err);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Lưu trạng thái dark mode vào localStorage + cập nhật class trên document
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <UserContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        isDarkMode,
        toggleDarkMode,
        loadingUser,
      }}
    >
      {loadingUser ? (
        <div className="flex justify-center items-center min-h-screen text-lg">
          <p>Loading user data...</p>
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};