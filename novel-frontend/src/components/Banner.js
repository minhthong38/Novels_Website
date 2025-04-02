import React, { useState, useEffect } from 'react';

const banners = [
  {
    src: 'https://lavidaplus.com.vn/wp-content/uploads/2024/11/banner-doc-sach-vi-tuong-lai-amo-vietnam-2018.jpg',
    alt: 'Banner 1',
  },
  {
    src: 'https://www.nxbgd.vn/Attachments/images/Sach%20moi/CMLBT_BANNER-WEB-BOOKIZ.png',
    alt: 'Banner 2',
  },
  {
    src: 'https://sachkhainguyen.com/wp-content/uploads/2023/03/slide-3.jpg',
    alt: 'Banner 3',
  }
];

const Banner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length);
    }, 3000); // Change banner every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" relative w-full h-60 sm:h-72 md:h-96 bg-gray-800 overflow-hidden">
      <img
        src={banners[currentBanner].src}
        alt={banners[currentBanner].alt}
        className="absolute inset-0 object-cover w-full h-full opacity-70"
      />
    
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full ${currentBanner === index ? 'bg-white' : 'bg-gray-500'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
