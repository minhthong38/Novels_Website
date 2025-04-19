import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import AuthorSidebar from '../sidebar/AuthorSidebar'; // Import AuthorSidebar

export default function UpdateNovel() {
  const { loggedInUser, isDarkMode } = useContext(UserContext); // Use global dark mode state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChapters, setFilteredChapters] = useState([]);
  const chapters = [
    { chapter: "Chương 1: Nhà ảo thuật", views: 550 },
    { chapter: "Chương 2: Cô gái đến từ hôm qua", views: 503 },
    { chapter: "Chương 3: Bắt đền hoa sứ", views: 682 },
    { chapter: "Chương 4: Quán kem", views: 710 },
    { chapter: "Chương 5: Những con gấu bông", views: 762 },
    { chapter: "Chương 6: Nữ hiệp áo hoa", views: 874 },
    { chapter: "Chương 7: Những con chim én", views: 804 },
    { chapter: "Chương 8: Một thiên nằm mộng", views: 955 },
    { chapter: "Chương 9: Bí mật của một võ sư", views: 1150 },
    { chapter: "Chương 10: Lọ thuốc tăng hình", views: 2200 },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    setFilteredChapters(
      chapters.filter((chapter) =>
        chapter.chapter.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để cập nhật truyện.</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <AuthorSidebar activeView="updateNovel" /> {/* Use AuthorSidebar */}
      <main className="w-full md:w-3/4 p-4">
        <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
          Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam. Tác giả lưu ý khi đăng tải tác phẩm. Nếu vi phạm bạn có thể bị khoá truyện, nếu tái phạm có thể bị khoá tài khoản vĩnh viễn.
        </div>
        <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
          - Truyện sau khi đăng đủ 5 chương mới có thể gửi duyệt.<br />
          - Truyện sau khi gửi duyệt yêu cầu duyệt sẽ mất từ 1-2 ngày để xem xét. Khi đã duyệt hoặc không duyệt bạn sẽ nhận được thông báo.
        </div>
        <div className="flex flex-col md:flex-row mb-4">
          <img src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1336126336i/13633451.jpg" alt="Book cover" className="w-24 h-36 mx-auto md:mx-0 md:mr-4" />
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold">KÍNH VẠN HOA</h3>
            <p>Thể loại: Tình cảm gia đình, Phiêu Lưu</p>
            <p>Số chương: 56 chương</p>
            <p>Tình trạng: <span className="text-green-600 font-bold">Đã hoàn thành</span></p>
          </div>
        </div>
        <div className="mb-4 text-center">
          <button
            className={`px-4 py-2 rounded shadow-md ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
            onClick={() => alert('Thêm chương mới')}
          >
            + Thêm Chương
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm chương..."
            className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className={`min-w-full border ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}>
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Số thứ tự</th>
              <th className="py-2 px-4 border-b text-left">Chương</th>
              <th className="py-2 px-4 border-b text-left">Lượt xem</th>
              <th className="py-2 px-4 border-b text-left">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredChapters.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{item.chapter}</td>
                <td className="py-2 px-4 border-b">{item.views}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className={`hover:underline ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                    onClick={() => navigate('/chapter')}
                  >
                    Cập nhật
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
