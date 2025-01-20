import React from 'react';

const Banner = () => {
  return (
    <div className="mt-7 relative w-full h-96 bg-gray-800 overflow-hidden">
      <img
        src="https://lavidaplus.com.vn/wp-content/uploads/2024/11/banner-doc-sach-vi-tuong-lai-amo-vietnam-2018.jpg"
        alt="Banner"
        className="absolute inset-0 object-cover w-full h-full opacity-70"
      />
      <div className=" relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <p className="mb-4">Khám phá nội dung thú vị và khuyến mãi mới nhất.</p>
        <a
          href="#"
          className="px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 transition"
        >
          Khám Phá Ngay
        </a>
      </div>
    </div>
  );
};

export default Banner;
