import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('loggedInUser');
      return storedUser ? JSON.parse(storedUser) : null; // Retrieve minimal user details
    } catch (error) {
      console.error('Failed to retrieve user from localStorage:', error);
      return null;
    }
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

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
