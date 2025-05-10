import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { fetchNovelRankings, fetchReaderRankings, fetchAuthorRankings } from '../../services/apiService';
import './topRanking.css'; // Import the CSS file for animations

export default function TopRanking() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(UserContext);
  const [novelRankings, setNovelRankings] = useState([]);
  const [readerRankings, setReaderRankings] = useState([]);
  const [authorRankings, setAuthorRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReader, setSelectedReader] = useState(null);
  const [showReaderPopup, setShowReaderPopup] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const getNovelRankings = async () => {
      try {
        const data = await fetchNovelRankings();
        if (data && data.data) {
          // Filter out any invalid entries
          const validNovels = data.data.filter(novel => 
            novel?.idNovel?._id && novel?.idNovel?.title
          );
          setNovelRankings(validNovels);
        } else {
          setNovelRankings([]);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching novel rankings');
        setNovelRankings([]);
      }
    };
  
    const getReaderRankings = async () => {
      try {
        const data = await fetchReaderRankings();
        if (data) {

          console.log("Valid Readers:", data);
          
          // Sắp xếp theo totalExp giảm dần
          data.sort((a, b) => b.idReaderExp.totalExp - a.idReaderExp.totalExp);
 
    
          setReaderRankings(data);
        } else {
          setReaderRankings([]);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching reader rankings');
        setReaderRankings([]);
      }
    };
    
  
    const getAuthorRankings = async () => {
      try {
        const data = await fetchAuthorRankings();
        if (data) {
          // Filter out any invalid entries
          const validAuthors = data.filter(author => 
            author?.idUser?._id && author?.idUser?.fullname
          );
          setAuthorRankings(validAuthors);
        } else {
          setAuthorRankings([]);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching author rankings');
        setAuthorRankings([]);
      } finally {
        setLoading(false);
      }
    };
  
    getNovelRankings();
    getReaderRankings();
    getAuthorRankings();
  }, []);
  
  

  const handleNovelClick = (novelID) => {
    navigate(`/novelDetail/${novelID}`);
  };

  const handleReaderClick = (reader) => {
    setSelectedReader(reader);
    setShowReaderPopup(true);
  };

  const closeReaderPopup = () => {
    setShowReaderPopup(false);
    setSelectedReader(null);
  };

  return (
    <div
      className={`py-10 ${
        isDarkMode
          ? 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 text-white'
          : 'bg-gradient-to-r from-blue-200 via-blue-300 to-gray-300 text-black'
      }`}
    >
      <div className="flex flex-col pt-10 justify-center items-center md:flex-row space-y-4 md:space-y-0 md:space-x-4 relative">
        {/* Left Wing with Animation */}
        <img
          src="https://imgur.com/G9PNx3f.jpg" // Replace with your desired wing image URL
          alt="Left Wing"
          className="absolute left-20 top-[calc(50%-10px)] transform -translate-y-1/2 hidden md:block w-40 h-auto animate-flap"
        />

        {/* TOP ĐỘC GIẢ */}
        <div className={`p-4 rounded-lg shadow-md w-full md:w-80 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-center font-bold text-xl mb-4">TOP ĐỘC GIẢ</h2>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : readerRankings.length > 0 ? (
            <>
              <div className="flex flex-col items-center mb-4 cursor-pointer" onClick={() => handleReaderClick(readerRankings[0])}>
              <img 
                src={readerRankings[0].idUser.avatar || 'https://via.placeholder.com/150'} 
                alt={readerRankings[0].idUser.fullname}
                className="w-24 h-24 rounded-full"
              />
              <span className="text-center mt-2">{readerRankings[0].idUser.fullname} 🥇</span>
            </div>
            <div className="overflow-y-auto h-64">
              {readerRankings.slice(1).map((reader, index) => (
                <div key={reader.idUser._id} className="flex items-center mb-4 cursor-pointer" onClick={() => handleReaderClick(reader)}>
                  <span className="flex-1 text-left">
                    {index + 2}. {reader.idUser.fullname} 
                    {index === 0 ? '🥈' : index === 1 ? '🥉' : ''}
                  </span>
                </div>
              ))}
            </div>

            </>
          ) : (
            <p className="text-center">No rankings available</p>
          )}
        </div>

        {/* TOP TRUYỆN */}
        <div className={`p-4 rounded-lg shadow-md w-full md:w-80 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-center font-bold text-xl mb-4">TOP TRUYỆN</h2>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : novelRankings && novelRankings.length > 0 ? (
            <>
              <div className="flex flex-col items-center mb-4 cursor-pointer" onClick={() => handleNovelClick(novelRankings[0].idNovel._id)}>
                <img 
                  src={novelRankings[0].idNovel.imageUrl || 'https://via.placeholder.com/150'} 
                  alt={`Book cover of ${novelRankings[0].idNovel.title}`} 
                  className="w-24 h-36"
                />
                <span className="text-center mt-2">{novelRankings[0].idNovel.title} 🥇</span>
              </div>
              <div className="overflow-y-auto h-64">
              {novelRankings.slice(1).map((novel, index) => (
                <div key={novel.idNovel._id} className="flex items-center mb-4 cursor-pointer" onClick={() => handleNovelClick(novel.idNovel._id)}>
                  <span className="flex-1 text-left">{index + 2}. {novel.idNovel.title} {index === 0 ? '🥈' : index === 1 ? '🥉' : ''}</span>
                </div>
              ))}

              </div>
            </>
          ) : (
            <p className="text-center">Chưa có dữ liệu xếp hạng</p>
          )}
        </div>

       {/* TOP TÁC GIẢ */}
        <div className={`p-4 rounded-lg shadow-md w-full md:w-80 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-center font-bold text-xl mb-4">TOP TÁC GIẢ</h2>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : authorRankings.length > 0 ? (
            <>
              <div className="flex flex-col items-center mb-4 cursor-pointer" onClick={() => navigate(`/authors/${authorRankings[0]?.idUser?._id}`)}>
                <img
                  src={authorRankings[0]?.idUser?.avatar || 'https://via.placeholder.com/150'}
                  alt={`Avatar of ${authorRankings[0]?.idUser?.fullname}`}
                  className="w-24 h-24 rounded-full border-2 border-blue-300 hover:scale-105 transition-transform duration-200"
                />
                <span className="text-center mt-2 font-semibold text-white">{authorRankings[0]?.idUser?.fullname} 🥇</span>
              </div>
              {/* Các tác giả xếp hạng tiếp theo */}
              <div className="overflow-y-auto h-64">
                {authorRankings.slice(1).map((author, index) => (
                  <div key={author._id} className="flex items-center mb-4 cursor-pointer" onClick={() => navigate(`/authors/${author.idUser._id}`)}>
                    <span className="flex-1 text-left text-white font-medium">
                      {index + 2}. {author.idUser.fullname} {index === 0 ? '🥈' : index === 1 ? '🥉' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center">No rankings available</p>
          )}
        </div>

        {/* Right Wing with Animation */}
        <img
          src="https://imgur.com/HHyv12D.jpg" // Replace with your desired wing image URL
          alt="Right Wing"
          className="absolute right-20 top-[calc(50%-10px)] transform -translate-y-1/2 hidden md:block w-40 h-auto animate-flap"
        />
      </div>

      {/* Reader Popup */}
      {showReaderPopup && selectedReader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg max-w-md w-full mx-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Thông tin độc giả</h3>
              <button onClick={closeReaderPopup} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={selectedReader.idUser.avatar || 'https://via.placeholder.com/150'}
                alt={selectedReader.idUser.fullname}
                className="w-32 h-32 rounded-full mb-4"
              />
              <h4 className="text-xl font-semibold mb-2">{selectedReader.idUser.fullname}</h4>
              <p className="text-gray-600 mb-2">Email: {selectedReader.idUser.email}</p>
              <p className="text-gray-600 mb-2">Username: {selectedReader.idUser.username}</p>
              <p className="text-gray-600 mb-2">Điểm kinh nghiệm: {selectedReader.totalExp || 0}</p>
              <p className="text-gray-600 mb-2">Cấp độ: {selectedReader.idLevel?.level || 1}</p>
              <p className="text-gray-600 mb-2">Danh hiệu: {selectedReader.idLevel?.title || 'Chưa có'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}