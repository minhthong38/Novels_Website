import React from 'react';

export default function UserNotification({ notification, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Thông báo</h2>
        <p>{notification.message}</p>
        <button 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
