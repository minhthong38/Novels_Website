import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReadingHistories } from '../../services/apiService'; // Import API service
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function History() {
  const navigate = useNavigate();
  const { isDarkMode, loggedInUser } = useContext(UserContext); // Get dark mode state and logged-in user from context
  const [readNovels, setReadNovels] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchHistory = async () => { 
      if (!loggedInUser || !loggedInUser._id) { 
        console.error('User ID is missing.'); 
        setLoading(false); 
        return; 
      }
  
      try { 
        const histories = await fetchReadingHistories(loggedInUser._id);  
        setReadNovels(histories || []); // Ensure full reading history is fetched
      } catch (error) { 
        console.error('Error fetching reading histories:', error); 
      } finally { 
        setLoading(false); 
      } 
    };
  
    fetchHistory(); 
  }, [loggedInUser]);

  const handleResumeReading = (novel, chapter) => {
    if (novel?._id && chapter?._id) {
      navigate(`/novelView/${novel._id}?chapterId=${chapter._id}`); // Navigate to the specific novel and chapter
    } else {
      console.error('Missing novel or chapter data for navigation.');
    }
  };

  const handleClearHistory = async () => {
    // Clear history logic (if needed, implement API call to delete history)
    setReadNovels([]);
  };

  if (loading) {
    return <div className="text-center mt-10">Đang tải lịch sử đọc...</div>;
  }

  return (
    <div
      className={`flex justify-center items-start p-8 sm:p-4 min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
      }`}
    >
      <div
        className={`shadow-md rounded-lg p-6 w-full max-w-4xl ${
          isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'
        }`}
      >
        <h2 className="font-bold text-lg mb-4">LỊCH SỬ ĐỌC</h2>
        {readNovels && readNovels.length === 0 ? ( // Safely check length
          <div className="text-center">
            <img
              src="https://imgur.com/cx9u9rN.png"
              alt="No history icon"
              className="mx-auto mb-2 w-32 h-32 sm:w-24 sm:h-24"
            />
            <p>Bạn chưa đọc tiểu thuyết nào, đọc ngay nhé!!!</p>
          </div>
        ) : (
          readNovels.map((history) => (
            <div
              key={history._id}
              className={`p-4 rounded-lg mb-4 flex flex-col sm:flex-row items-center ${
                isDarkMode
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              <img
                src={history.idNovel?.imageUrl || 'https://via.placeholder.com/150'}
                alt={`Book cover of '${history.idNovel?.title || 'Unknown'}'`}
                className="w-24 h-36 rounded-lg mb-4 sm:mb-0 sm:mr-4"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold">{history.idNovel?.title || 'Unknown Title'}</h3>
                <p className="text-sm">Chapter: {history.idChapter?.title || 'Unknown Chapter'}</p> 
                <p className="text-sm">Last read: {new Date(history.lastReadAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-col space-y-2 mt-4 sm:mt-0 sm:ml-4">
                <button
                  onClick={() => handleResumeReading(history.idNovel, history.idChapter)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center text-sm sm:text-xs"
                >
                  <i className="fas fa-play mr-2"></i>
                  <span>ĐỌC TIẾP</span>
                </button>
              </div>
            </div>
          ))
        )}
        {readNovels && readNovels.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 w-full sm:w-auto"
          >
            Xóa lịch sử đọc
          </button>
        )}
      </div>
    </div>
  );
}
