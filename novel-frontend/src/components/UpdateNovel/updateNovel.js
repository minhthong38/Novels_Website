import React, { useContext, useEffect, useState } from 'react';
import AuthorRoute from '../routes/AuthorRoute';
import { UserContext } from '../../context/UserContext';
import AuthorStickyNote from "../AuthorStickyNote";

export default function UpdateNovel() {
  const { loggedInUser } = useContext(UserContext);
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

  useEffect(() => {
    setFilteredChapters(
      chapters.filter((chapter) =>
        chapter.chapter.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  useEffect(() => {
    console.log('loggedInUser:', loggedInUser); // Add debug log
  }, [loggedInUser]);

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để cập nhật truyện.</div>;
  }

  return (
    <div className="flex">
      <main className="w-3/4 p-4">
        <div className="flex flex-col md:flex-row">
          <main className="flex-1 p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4">
              <p>Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam. Tác giả lưu ý khi đăng tải tác phẩm. Nếu vi phạm bạn có thể bị khoá truyện, nếu tái phạm có thể bị khoá tài khoản vĩnh viễn.</p>
            </div>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4">
              <p>- Truyện sau khi đăng đủ 5 chương mới có thể gửi duyệt.</p>
              <p>- Truyện sau khi gửi duyệt yêu cầu duyệt sẽ mất từ 1-2 ngày để xem xét. Khi đã duyệt hoặc không duyệt bạn sẽ nhận được thông báo.</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-bold">TỈ LỆ CHIA SẺ DOANH THU: 60% - 40%</h2>
            </div>
            <div className="flex mb-4">
              <img src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1336126336i/13633451.jpg" alt="Book cover" className="w-24 h-36 mr-4" />
              <div>
                <h3 className="text-2xl font-bold">KÍNH VẠN HOA</h3>
                <p>Thể loại: Tình cảm gia đình, Phiêu Lưu</p>
                <p>Số chương: 56 chương</p>
                <p>Tình trạng: <span className="text-green-600 font-bold">Đã hoàn thành</span></p>
              </div>
            </div>

            {/* Add Chapter Button */}
            <div className="mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
                onClick={() => alert('Thêm chương mới')}
              >
                + Thêm Chương
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm chương..."
                className="border border-gray-300 p-2 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <table className="min-w-full bg-white border border-gray-300">
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
                    <td className="py-2 px-4 border-b text-left">{index + 1}</td>
                    <td className="py-2 px-4 border-b text-left">{item.chapter}</td>
                    <td className="py-2 px-4 border-b text-left flex items-center">
                      {item.views}
                      <i className="fas fa-eye ml-2"></i>
                    </td>
                    <td className="py-2 px-4 border-b text-left text-green-600">
                      <a href="/chapter">Cập nhật</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </div>
      </main>
    </div>
  );
}
