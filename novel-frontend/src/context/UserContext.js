import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedDarkMode = localStorage.getItem('darkMode');

      if (savedUser) {
        setLoggedInUser(JSON.parse(savedUser));
      }

      setIsDarkMode(savedDarkMode ? JSON.parse(savedDarkMode) : false);
    } catch (err) {
      console.error('Không thể đọc dữ liệu từ localStorage:', err);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Đồng bộ user vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [loggedInUser]);

  // Đồng bộ dark mode và cập nhật DOM
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Trả ra provider với dữ liệu context
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
          <p>Đang khởi tạo người dùng...</p>
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};
