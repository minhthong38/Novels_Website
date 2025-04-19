import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-8 relative">
      {/* Add a subtle fade effect at the top */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-gray-900 to-transparent"></div>
      <div className="container mx-auto flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:items-center sm:space-y-0 sm:space-x-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src="https://imgur.com/pc05sxO.png" alt="Logo" className="w-32 h-12" />
        </div>
        {/* Divider */}
        <div className="hidden sm:block w-px bg-gray-500 h-16"></div>
        {/* Contact information */}
        <div className="text-white text-sm text-center sm:text-left">
          <b>
            <p>Số điện thoại: 0987654321</p>
            <p>Email: novelwebsite@gmail.com</p>
            <p>Địa chỉ cửa hàng:</p>
            <p>69/68 Đường Quang Trung, Quận Bình Thạnh, TP.HCM</p>
            <p>45 Nguyễn Thái Học, Quận 1, TP.HCM</p>
            <p>233A Phan Văn Trị, Quận Bình Thạnh, TP.HCM</p>
          </b>
        </div>
      </div>
    </footer>
  );
}
