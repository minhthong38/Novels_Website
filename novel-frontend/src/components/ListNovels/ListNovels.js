import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import { fetchNovelsByAuthor, fetchChaptersByNovelId } from '../../services/apiService';

export default function ListNovels() {
  const [novels, setNovels] = useState([]);
  const [filteredNovels, setFilteredNovels] = useState([]);
  const [chapterCounts, setChapterCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { loggedInUser, isDarkMode } = useContext(UserContext);

  // Fetch novels by logged in user
  useEffect(() => {
    if (!loggedInUser || !loggedInUser.id) return;
  
    const fetchData = async () => {
      try {
        const data = await fetchNovelsByAuthor(loggedInUser.id);
        setNovels(data);
        setFilteredNovels(data); // Khởi tạo danh sách lọc ban đầu
  
        // Fetch chapter count cho từng truyện
        const counts = {};
        await Promise.all(data.map(async (novel) => {
          const chapters = await fetchChaptersByNovelId(novel._id);
          const maxOrder = chapters.reduce((max, ch) => ch.order > max ? ch.order : max, 0);
          counts[novel._id] = maxOrder;
        }));
        setChapterCounts(counts);
      } catch (error) {
        console.error('Không thể tải danh sách tiểu thuyết:', error);
      }
    };
  
    fetchData();
  }, [loggedInUser?.id]);
  
  // Filter novels based on search term
  useEffect(() => {
    setFilteredNovels(
      novels.filter(novel =>
        novel.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, novels]);

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để xem danh sách truyện.</div>;
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
                      <button 
                        className={`px-4 py-2 mt-5 rounded ${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`}
                        onClick={() => navigate('/updateNovel', { state: { novel } })}
                      >
                        CẬP NHẬT
                      </button>
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
