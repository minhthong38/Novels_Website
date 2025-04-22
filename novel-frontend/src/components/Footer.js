import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 relative">
      {/* Gradient effect */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-gray-800 to-transparent"></div>
      <div className="container mx-auto px-8 lg:px-16">
        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <p>Số điện thoại: 0987654321</p>
            <p>Email: novelwebsite@gmail.com</p>
            <p>Địa chỉ cửa hàng:</p>
            <p>69/68 Đường Quang Trung, Quận Bình Thạnh, TP.HCM</p>
            <p>45 Nguyễn Thái Học, Quận 1, TP.HCM</p>
            <p>233A Phan Văn Trị, Quận Bình Thạnh, TP.HCM</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <h3 className="text-white text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center space-x-4 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.icons8.com/color/48/facebook.png"
                  alt="Facebook"
                  className="w-10 h-10"
                />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.icons8.com/color/48/instagram-new.png"
                  alt="Instagram"
                  className="w-10 h-10"
                />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.icons8.com/color/48/youtube-play.png"
                  alt="YouTube"
                  className="w-10 h-10"
                />
              </a>
            </div>
            <div className="flex justify-center">
              <img
                src="https://imgur.com/pc05sxO.png"
                alt="Logo"
                className="w-40 h-20"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8"></div>

        {/* Copyright Section */}
        <div className="text-center mt-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Novel Website. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
