import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchReadingHistories, deleteAllReadingHistory } from '../../services/apiService'; // Import API service
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function History() {
  const navigate = useNavigate();
  const { isDarkMode, loggedInUser } = useContext(UserContext); // Get dark mode state and logged-in user from context
  const location = useLocation();
  const [readNovels, setReadNovels] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!loggedInUser.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userId = loggedInUser.id || loggedInUser._id;
        
        const response = await fetchReadingHistories(userId);
        
        if (response && Array.isArray(response)) {
          setReadNovels(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setReadNovels(response.data);
        } else {
          console.error('Invalid reading histories data format:', response);
          setError('Không thể tải lịch sử đọc. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error('Error fetching reading histories:', error);
        setError('Không thể tải lịch sử đọc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [loggedInUser?._id, location.pathname]);

  const handleResumeReading = (novel, chapter) => {
    if (novel?._id && chapter?._id) {
      navigate(`/novelView/${novel._id}?chapterId=${chapter._id}`, { 
        state: { scrollToBookmark: true } 
      }); // Navigate to the specific novel and chapter
    } else {
      console.error('Missing novel or chapter data for navigation.');
    }
  };

  const handleClearHistory = async () => {
    if (!loggedInUser || !loggedInUser._id) {
      console.error('User ID is missing.');
      return;
    }

    try {
      // Call the API to delete all reading history for the logged-in user
      await deleteAllReadingHistory(loggedInUser._id); // Use loggedInUser._id
      setReadNovels([]); // Clear the local state after deleting history
      alert('Lịch sử đọc đã được xóa!');
    } catch (error) {
      console.error('Error deleting all reading history:', error);
      alert('Xóa lịch sử đọc không thành công!');
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
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
        
        {error && (
          <div className="p-4 rounded-lg bg-red-100 text-red-700 mb-4">
            {error}
          </div>
        )}

        {readNovels && readNovels.length === 0 ? (
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
                isDarkMode ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'
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
