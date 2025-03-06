import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserStickyNote from '../UserStickyNote'; 
import { novels, categories, users } from '../../data/data';  // Adjust the import path as needed
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function NovelDetail() {
  const [activePart, setActivePart] = useState(null);
  const [novel, setNovel] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);  // Add this line
  const navigate = useNavigate();
  const { novelID } = useParams();
  const { isDarkMode } = useContext(UserContext); // Get dark mode state from context

  useEffect(() => {
    const selectedNovel = novels.find(novel => novel.NovelID === parseInt(novelID));
    setNovel(selectedNovel);
  }, [novelID]);

  const parts = [
    { label: 'Phần 1' },
    { label: 'Phần 2' },
    { label: 'Phần 3' },
    { label: 'Phần 4' },
  ];

  const handlePartClick = (label) => {
    setActivePart(label);
  };

  const glowEffect = {
    boxShadow: "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #00f, 0 0 50px #00f, 0 0 60px #00f, 0 0 70px #00f",
    color: "#fff",
    borderRadius: "5px",
    transition: "all 0.3s ease-in-out",
    padding: "8px 16px"
  };

  const fireworksEffect = {
    animation: "fireworks 1s forwards",
  };

  const sparkleEffect = {
    animation: "sparkle 1s forwards",
  };

  const handleReadBookClick = () => {
    navigate(`/novelView/${novelID}`);
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    const button = document.querySelector('.favorite-button');
    button.classList.add('fireworks');

    setTimeout(() => {
      button.classList.remove('fireworks');
    }, 1000);
  };

  const categoryName = categories.find(category => category.CategoryID === novel.CategoryID)?.CategoryName;
  const author = users.find(user => user.UserID === novel.AuthorID);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="w-full p-12">
        {novel && (
          <>
            <div className="bg-blue-700 text-white p-6 rounded-lg flex flex-col md:flex-row">
              <div className="flex-1 flex flex-col md:flex-row md:items-start">
                <img src={novel.ImageUrl} alt={`Book cover with title '${novel.Title}'`} className="w-48 h-64 mb-4 md:mb-0" />
                <div className="flex-1 flex flex-col items-center md:items-start md:ml-6">
                  <h1 className="text-2xl font-bold">{novel.Title}</h1>
                  <p className="text-lg">Trang chủ / Thể loại / {categoryName}</p>
                  <div className="flex items-center mt-2">
                    <Link to="/authors" className="flex items-center">
                      <img src="https://i.imgur.com/Y0N4tO3.png" alt="User icon" className="w-8 h-8" />
                      <span className="ml-2 underline text-lg">{author?.Username}</span>
                    </Link>
                    <button className="flex items-center ml-6 focus:outline-none">
                      <img src="https://i.imgur.com/E1RJHdo.png" alt="Heart icon" className="w-8 h-8" />
                      <span className="ml-2 underline text-lg">Yêu thích</span>
                    </button>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleReadBookClick}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg mr-4 mb-5 text-lg"
                    >
                      Đọc sách
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 mt-6 md:mt-0 md:ml-36">
                <div className="bg-blue-800 p-10 rounded-lg flex w-68">
                  <ul className="text-white text-lg text-left space-y-2">
                    {parts.map((part) => (
                      <li key={part.label}>
                        <button
                          style={activePart === part.label ? glowEffect : null}
                          className="hover:text-amber-500 transition duration-300 ease-in-out transform"
                          onClick={() => handlePartClick(part.label)}
                        >
                          {part.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-12 flex flex-col md:flex-row ml-0 md:ml-12">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6">GIỚI THIỆU NỘI DUNG</h2>
                <p className="mb-6 text-lg">{novel.Description}</p>
              </div>
              <div className="flex-1 mt-12 md:mt-0 md:ml-12">
                <h2 className="text-2xl font-bold mb-6">SÁCH ĐỀ XUẤT</h2>
                <div className="flex items-center mb-6">
                  <Link to="/novelDetail/tư-duy-ngược" className="flex items-center">
                    <img src="https://i.imgur.com/OoGAP3P.png" alt="Book cover with title 'Tư duy ngược'" className="w-32 h-48" />
                    <span className="ml-4 text-xl">TƯ DUY NGƯỢC</span>
                  </Link>
                </div>
                <div className="flex items-center">
                  <Link to="/novelDetail/đắc-nhân-tâm" className="flex items-center">
                    <img src="https://i.imgur.com/dPSZ21C.png" alt="Book cover with title 'Đắc nhân tâm'" className="w-32 h-48" />
                    <span className="ml-4 text-xl">ĐẮC NHÂN TÂM</span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
        <UserStickyNote /> 
      </div>
    </div>
  );
}
