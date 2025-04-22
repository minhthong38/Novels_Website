import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { fetchNovelRankings, fetchReaderRankings, fetchAuthorRankings } from '../../services/apiService';

export default function TopRanking() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(UserContext);
  const [novelRankings, setNovelRankings] = useState([]);
  const [readerRankings, setReaderRankings] = useState([]);
  const [authorRankings, setAuthorRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const getNovelRankings = async () => {
      try {
        const data = await fetchNovelRankings();
        setNovelRankings(data.data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    const getReaderRankings = async () => {
      try {
        const data = await fetchReaderRankings();
        setReaderRankings(data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    const getAuthorRankings = async () => {
      try {
        const data = await fetchAuthorRankings();
        setAuthorRankings(data);
      } catch (err) {
        setError(err.message || 'An error occurred');
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

  const handleReaderClick = (readerID) => {
    navigate(`/readerDetail/${readerID}`); // Chuyển hướng khi nhấp vào độc giả
  };
  return (
    <div className="flex flex-col pt-10 justify-center items-center md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      {/* TOP ĐỘC GIẢ */}
      <div className={`p-4 rounded-lg shadow-md w-full md:w-80 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-center font-bold text-xl mb-4">TOP ĐỘC GIẢ</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : readerRankings.length > 0 ? (
          <>
            <div className="flex flex-col items-center mb-4 cursor-pointer" onClick={() => handleReaderClick(readerRankings[0].idUser._id)}>
              <img 
                src={readerRankings[0].idUser.avatar || 'https://via.placeholder.com/150'} 
                alt={readerRankings[0].idUser.fullname}
                className="w-24 h-24 rounded-full"
              />
              <span className="text-center mt-2">{readerRankings[0].idUser.fullname} 🥇</span>
            </div>
            <div className="overflow-y-auto h-64">
              {readerRankings.map((reader, index) => (
                <div key={reader.idUser._id} className="flex items-center mb-4 cursor-pointer" onClick={() => handleReaderClick(reader.idUser._id)}>
                  {index !== 0 && (
                    <>
                      <span className="flex-1 text-left">{index + 1}. {reader.idUser.fullname} {index === 1 ? '🥈' : index === 2 ? '🥉' : ''}</span>
                      {index < 3 && (
                        <span className={`text-2xl ${index === 1 ? 'text-gray-400' : 'text-orange-500'}`}>
                          <i className="fas fa-medal"></i>
                        </span>
                      )}
                    </>
                  )}
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
        ) : novelRankings.length > 0 ? (
          <>
            <div className="flex flex-col items-center mb-4 cursor-pointer" onClick={() => handleNovelClick(novelRankings[0].idNovel._id)}>
              <img src={novelRankings[0].idNovel.imageUrl} alt={`Book cover of '${novelRankings[0].idNovel.title}'`} className="w-24 h-36" />
              <span className="text-center mt-2">{novelRankings[0].idNovel.title} 🥇</span>
            </div>
            <div className="overflow-y-auto h-64">
              {novelRankings.map((novel, index) => (
                <div key={novel.idNovel._id} className="flex items-center mb-4 cursor-pointer" onClick={() => handleNovelClick(novel.idNovel._id)}>
                  {index !== 0 && (
                    <>
                      <span className="flex-1 text-left">{index + 1}. {novel.idNovel.title} {index === 1 ? '🥈' : index === 2 ? '🥉' : ''}</span>
                      {index < 3 && (
                        <span className={`text-2xl ${index === 1 ? 'text-gray-400' : 'text-orange-500'}`}>
                          <i className="fas fa-medal"></i>
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center">No rankings available</p>
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
            <div className="flex flex-col items-center mb-4 cursor-pointer">
              <img
                src={authorRankings[0]?.idUser?.avatar || 'https://via.placeholder.com/150'}
                alt={`Avatar of ${authorRankings[0]?.idUser?.fullname}`}
                className="w-24 h-24 rounded-full"
              />
              <span className="text-center mt-2">{authorRankings[0]?.idUser?.fullname} 🥇</span>
            </div>
            {/* Các tác giả xếp hạng tiếp theo */}
            <div className="overflow-y-auto h-64">
              {authorRankings.slice(1).map((author, index) => (
                <div key={author._id} className="flex items-center mb-4">
                  <span className="flex-1 text-left">
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
    </div>
  );
}