import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar'; // Import AuthorSidebar

export default function Chapter() {
  const { loggedInUser, isDarkMode } = useContext(UserContext);

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để chỉnh sửa chương.</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <AuthorSidebar activeView="chapter" /> {/* Use AuthorSidebar */}
      <main className="w-full md:w-3/4 p-8">
        <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
          Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam.
        </div>
        <h1 className="text-2xl font-bold mb-6">Chỉnh Sửa Chương</h1>
        <textarea
          className={`border rounded w-full px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
          rows="10"
          placeholder="Nhập nội dung chương"
        ></textarea>
      </main>
    </div>
  );
}
