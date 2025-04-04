import React, { useContext, useEffect, useState } from 'react';
import { topReaders, topAuthors } from '../../data/data';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { fetchNovelRankings } from '../../services/apiService';

export default function TopRanking() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(UserContext);
  const [novelRankings, setNovelRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNovelRankings = async () => {
      try {
        const data = await fetchNovelRankings();
        setNovelRankings(data.data); // Assuming the API response contains a "data" field
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    getNovelRankings();
  }, []);

  const handleNovelClick = (novelID) => {
    navigate(`/novelDetail/${novelID}`);
  };

  return (
    <div className="flex flex-col pt-10 justify-center items-center md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div className={`p-4 rounded-lg shadow-md w-full md:w-80 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-center font-bold text-xl mb-4">TOP ĐỘC GIẢ</h2>
        <div className="flex flex-col items-center mb-4">
          <img src={topReaders[0].imageUrl} alt={`Image of ${topReaders[0].name}`} className="w-24 h-24 rounded-full" />
          <span className="text-center mt-2">{topReaders[0].name} 🥇</span>
        </div>
        <div className="overflow-y-auto h-64">
          {topReaders.map((reader, index) => (
            <div key={reader.id} className="flex items-center mb-4">
              {index !== 0 && (
                <>
                  <span className="flex-1 text-left">{index + 1}. {reader.name} {index === 1 ? '🥈' : index === 2 ? '🥉' : ''}</span>
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
      </div>
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
      <div className={`p-4 rounded-lg shadow-md w-full md:w-80 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-center font-bold text-xl mb-4">TOP TÁC GIẢ</h2>
        <div className="flex flex-col items-center mb-4">
          <img src={topAuthors[0].imageUrl} alt={`Image of ${topAuthors[0].name}`} className="w-24 h-24 rounded-full" />
          <span className="text-center mt-2">{topAuthors[0].name} 🥇</span>
        </div>
        <div className="overflow-y-auto h-64">
          {topAuthors.map((author, index) => (
            <div key={author.id} className="flex items-center mb-4">
              {index !== 0 && (
                <>
                  <span className="flex-1 text-left">{index + 1}. {author.name} {index === 1 ? '🥈' : index === 2 ? '🥉' : ''}</span>
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
      </div>
    </div>
  );
}
