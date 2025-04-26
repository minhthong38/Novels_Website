import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import { fetchNovelsByAuthor, fetchChaptersByNovelId, deleteNovel } from '../../services/apiService';

export default function ListNovels() {
  const [novels, setNovels] = useState([]);
  const [filteredNovels, setFilteredNovels] = useState([]);
  const [chapterCounts, setChapterCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loggedInUser, isDarkMode } = useContext(UserContext);

  // Fetch novels by logged in user
  useEffect(() => {
    const fetchData = async () => {
      if (!loggedInUser || !loggedInUser.id) return;
      
      try {
        setLoading(true);
        const data = await fetchNovelsByAuthor(loggedInUser.id);
        console.log('Fetched novels:', data); // Debug log
        
        if (data && Array.isArray(data)) {
          setNovels(data);
          setFilteredNovels(data);
          
          // Fetch chapter count for each novel
          const counts = {};
          await Promise.all(data.map(async (novel) => {
            try {
              const chapters = await fetchChaptersByNovelId(novel._id);
              const maxOrder = chapters.reduce((max, ch) => ch.order > max ? ch.order : max, 0);
              counts[novel._id] = maxOrder;
            } catch (error) {
              console.error(`Error fetching chapters for novel ${novel._id}:`, error);
              counts[novel._id] = 0;
            }
          }));
          setChapterCounts(counts);
        } else {
          console.error('Invalid novels data format:', data);
          setError('Không thể tải danh sách truyện. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error('Error fetching novels:', error);
        setError('Không thể tải danh sách truyện. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedInUser?._id]); // Add dependency on loggedInUser._id

  // Filter novels based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNovels(novels);
    } else {
      setFilteredNovels(
        novels.filter(novel =>
          novel.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, novels]);

  const handleDeleteNovel = async (novelId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa truyện này?')) {
      return;
    }

    try {
      await deleteNovel(novelId);
      // Update novels list after deletion
      setNovels(novels.filter(novel => novel._id !== novelId));
      setFilteredNovels(filteredNovels.filter(novel => novel._id !== novelId));
    } catch (error) {
      console.error('Error deleting novel:', error);
      setError('Không thể xóa truyện. Vui lòng thử lại sau.');
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để xem danh sách truyện.</div>;
  }

  if (loading) {
    return (
      <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
        <AuthorSidebar activeView="listNovels" />
        <main className="w-full md:w-3/4 p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <AuthorSidebar activeView="listNovels" />
      <main className="w-full md:w-3/4 p-4">
        <div className="w-full max-w-4xl p-4">
          <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
            Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam.
          </div>
          <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
            Truyện sau khi đăng đủ 5 chương mới có thể gửi duyệt.
          </div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">TỈ LỆ CHIA SẺ DOANH THU: 60% - 40%</h1>
            <button 
              className={`px-4 py-2 rounded ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}
              onClick={() => navigate('/createNovel')}
            >
              + THÊM TRUYỆN MỚI
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm Kiếm"
              className={`w-full p-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {error && (
            <div className="p-4 rounded-lg bg-red-100 text-red-700 mb-4">
              {error}
            </div>
          )}
          <div className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            {filteredNovels.length === 0 ? (
              <p>Không có tiểu thuyết nào.</p>
            ) : (
              filteredNovels.map((novel) => (
                <div key={novel._id} className="border-b pb-4 mb-4">
                  <div className="flex mb-4">
                    <img
                      src={novel.imageUrl}
                      alt="Book cover"
                      className="w-32 h-48 mr-4 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-lg font-bold">{novel.title}</h3>
                      <p>
                        Thể loại:{' '}
                        {Array.isArray(novel.idCategories)
                          ? novel.idCategories.map(cat => 
                              typeof cat === 'object' && cat !== null && cat.titleCategory 
                                ? cat.titleCategory 
                                : cat
                            ).join(', ')
                          : novel.idCategories}
                      </p>
                      <p>Số chương: {chapterCounts[novel._id] !== undefined ? chapterCounts[novel._id] : 'Đang tải...'}</p>
                      <div className="flex gap-2">
                        <button 
                          className={`px-4 py-2 mt-5 rounded ${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`}
                          onClick={() => navigate('/updateNovel', { state: { novel } })}
                        >
                          CẬP NHẬT
                        </button>
                        <button 
                          className={`px-4 py-2 mt-5 rounded ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}
                          onClick={() => handleDeleteNovel(novel._id)}
                        >
                          XÓA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
