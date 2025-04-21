import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Cập nhật localStorage mỗi khi loggedInUser thay đổi
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('user'); // Xoá khi logout
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser, isDarkMode, toggleDarkMode }}>
      {children}
    </UserContext.Provider>
  );
};
