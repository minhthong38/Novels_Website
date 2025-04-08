import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNovels } from '../../services/apiService'; // Import API service

const BlindBook = () => {
  const [spinning, setSpinning] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [displayedNovels, setDisplayedNovels] = useState([]); // Initialize as empty array
  const [spinHistory, setSpinHistory] = useState([]); // Track spin history
  const [activeTab, setActiveTab] = useState('books'); // Track active tab
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    const loadNovels = async () => {
      try {
        const novels = await fetchNovels();
        setDisplayedNovels(novels.slice(0, 7)); // Limit to 7 books
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch novels:', error);
        setLoading(false);
      }
    };

    loadNovels();
  }, []);

  const handleSpin = () => {
    setSpinning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * displayedNovels.length); // Adjust for dynamic length
      const selected = displayedNovels[randomIndex];
      setSelectedNovel(selected);
      setSpinHistory([...spinHistory, selected]); // Add to spin history
      setSpinning(false);
    }, 3000); // Spin for 3 seconds
  };

  const handleChangeNovels = () => {
    const shuffledNovels = [...displayedNovels].sort(() => 0.5 - Math.random());
    setDisplayedNovels(shuffledNovels.slice(0, 7)); // Limit to 7 books
  };

  const handleRead = () => {
    if (selectedNovel) {
      navigate(`/novelDetail/${selectedNovel._id}`); // Use `_id` from API data
    }
  };

  const handleClearHistory = () => {
    setSpinHistory([]); // Clear spin history
  };

  if (loading) {
    return <div className="text-center">Đang tải...</div>; // Show loading state
  }

  return (
    <div className="flex flex-col items-center" style={{ backgroundImage: 'url(https://img.freepik.com/free-photo/old-room-interior_1048-8886.jpg)', backgroundSize: 'cover', minHeight: '100vh' }}>
      <div className="flex flex-col lg:flex-row items-center justify-center">
        <div className="relative w-96 h-96 border-4 border-gray-300 rounded-full overflow-hidden m-10 lg:mr-12" style={{ backgroundColor: '#000000'}} >
          <div
            className={`absolute inset-0 flex items-center justify-center transition-transform duration-3000 ${spinning ? 'animate-spin' : ''}`}
            style={{ transform: `rotate(${spinning ? 360 * 5 : 0}deg)` }} // Spin 5 times
          >
            {displayedNovels.map((novel, index) => (
              <img
                key={index}
                src={novel.imageUrl} // Use `imageUrl` from API data
                alt={novel.title} // Use `title` from API data
                className="absolute"
                style={{
                  width: '64px', // Revert to original width
                  height: '96px', // Revert to original height
                  objectFit: 'cover', // Ensure no white borders
                  transform: `rotate(${index * (360 / displayedNovels.length)}deg) translate(140px) rotate(${index * (20 / displayedNovels.length)}deg)`, // Rotate each book in different direction
                  margin: '0 20px',
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-red-500"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="https://imgur.com/I8bS1Cm.png" alt="Arrow" className="w-32 h-32" /> {/* Add arrow image */}
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center mt-8">
        <button
          onClick={handleSpin}
          className="px-6 py-3 bg-red-500 text-white rounded-lg mb-4 lg:mb-0 lg:mr-4"
          disabled={spinning}
        >
          {spinning ? 'Đang quay...' : 'Quay'}
        </button>
        <button
          onClick={handleChangeNovels}
          className="px-6 py-3 bg-green-500 text-white rounded-lg"
          disabled={spinning}
        >
          Thay đổi sách
        </button>
      </div>
      {selectedNovel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-xl font-bold">{selectedNovel.title}</h2> {/* Use `title` */}
            <img
              src={selectedNovel.imageUrl}
              alt={selectedNovel.title}
              className="mt-4 mx-auto"
              style={{
                width: '250px', // Set a fixed width
                height: '250px', // Set a fixed height
                objectFit: 'cover', // Ensure no white borders
              }}
            />
            <button
              onClick={handleRead}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg"
            >
              Đọc
            </button>
            <button
              onClick={() => setSelectedNovel(null)}
              className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-lg w-96 m-10">
        <div className="flex justify-between mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'books' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('books')}
          >
            Sách
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('history')}
          >
            Lịch sử
          </button>
        </div>
        {activeTab === 'books' && (
          <ul className="list-disc pl-5">
            {displayedNovels.map((novel) => (
              <li key={novel._id} className="mb-2 flex items-center">
                <img
                  src={novel.imageUrl}
                  alt={novel.title}
                  className="mr-2"
                  style={{
                    width: '50px', // Set a fixed width
                    height: '50px', // Set a fixed height
                    objectFit: 'cover', // Ensure no white borders
                  }}
                />
                {novel.title}
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'history' && (
          <div>
            <ul className="list-disc pl-5 mb-4">
              {spinHistory.map((novel, index) => (
                <li key={index} className="mb-2 flex items-center">
                  <img
                    src={novel.imageUrl}
                    alt={novel.title}
                    className="mr-2"
                    style={{
                      width: 'auto', // Maintain aspect ratio
                      height: '50px', // Set a fixed height
                      objectFit: 'cover', // Ensure no white borders
                    }}
                  />
                  {novel.title}
                </li>
              ))}
            </ul>
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-500 text-white rounded-lg w-full"
            >
              Xóa lịch sử
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlindBook;
