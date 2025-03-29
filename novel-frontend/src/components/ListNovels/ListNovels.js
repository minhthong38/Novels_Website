import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


import { novels } from '../../data/data';
import { UserContext } from '../../context/UserContext'; // Ensure this import is correct and not causing a loop

export default function ListNovels() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNovels, setFilteredNovels] = useState(novels);
  const navigate = useNavigate();
  const { loggedInUser } = useContext(UserContext); // Get loggedInUser from context

  useEffect(() => {
    console.log('loggedInUser:', loggedInUser); // Add debug log
    setFilteredNovels(
      novels.filter(novel =>
        novel.Title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, loggedInUser]);

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để xem danh sách truyện.</div>;
  }

  return (

      <div className="flex">

        <div className="w-3/4 p-4">
          <div className="p-4"> {/* Removed flex and width classes */}
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">
                Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam. Tác giả khi đăng tải tác phẩm, nếu phát hiện có thể bị khoá tài khoản, hoặc tác phẩm sẽ bị gỡ bỏ.
              </span>
            </div>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">
                - Truyện sau khi đăng đủ 5 chương mới có thể gửi duyệt.<br />
                - Truyện sau khi gửi duyệt sẽ được duyệt tối đa từ 1-2 ngày để xem xét. Khi đã duyệt hoặc không duyệt sẽ nhận được thông báo.
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">TỈ LỆ CHIA SẺ DOANH THU: 60% - 40%</h1>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => navigate('/createNovel')} // Navigate to createNovel page
              >
                + THÊM TRUYỆN MỚI
              </button>
            </div>
            <h2 className="text-lg font-bold mb-4">THÔNG TIN TRUYỆN</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Tìm Kiếm"
                className="border border-gray-300 p-2 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="bg-white p-4 rounded shadow">
              {filteredNovels.map((novel) => (
                <div key={novel.NovelID} className="border-b border-gray-300 pb-4 mb-4">
                  <div className="flex mb-4">
                    <img
                      src={novel.ImageUrl} // Use ImageUrl property
                      alt="Book cover"
                      className="w-32 h-48 mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-bold">{novel.Title}</h3>
                      <p>Thể loại: {novel.CategoryID}</p>
                      <p>Số chương: {novel.Chapters?.length || 0} chương</p>
                      <p>Tình trạng: <span className="text-green-600">Đã hoàn thành</span></p>
                      <button 
                        className="bg-green-500 text-white px-4 py-2 mt-5 rounded"
                        onClick={() => navigate('/updateNovel')} // Navigate to updateNovel page
                      >
                        CẬP NHẬT
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

  );
}
