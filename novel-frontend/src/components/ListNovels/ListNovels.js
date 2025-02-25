import React from 'react'
import AuthorRoute from '../routes/AuthorRoute'
import { useNavigate } from 'react-router-dom';
// import AuthorStickyNote from "../AuthorStickyNote";

export default function ListNovels() {
    const navigate = useNavigate();
    const handleUpdate = () => {
        navigate('/updateNovel');
      };
  return (
  <AuthorRoute>
    <div className="flex">
                    {/* Main Content */}
                    <div className="w-3/4 p-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            <span className="block sm:inline">Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam. Tác giả khi đăng tải tác phẩm, nếu phát hiện có thể bị khoá tài khoản, hoặc tác phẩm sẽ bị gỡ bỏ.</span>
                        </div>
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                            <span className="block sm:inline">- Truyện sau khi đăng đủ 5 chương mới có thể gửi duyệt.<br />
                            - Truyện sau khi gửi duyệt sẽ được duyệt tối đa từ 1-2 ngày để xem xét. Khi đã duyệt hoặc không duyệt sẽ nhận được thông báo.</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-xl font-bold">TỈ LỆ CHIA SẺ DOANH THU: 60% - 40%</h1>
                            <button className="bg-red-500 text-white px-4 py-2 rounded">+ THÊM TRUYỆN MỚI</button>
                        </div>
                        <h2 className="text-lg font-bold mb-4">THÔNG TIN TRUYỆN</h2>
                        <div className="flex items-center mb-4">
                            <input type="text" placeholder="Tìm Kiếm" className="border border-gray-300 p-2 rounded w-full" />
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <div className="border-b border-gray-300 pb-4 mb-4">
                                <div className="flex mb-4">
                                    <img src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1336126336i/13633451.jpg" alt="Book cover" className="w-32 h-48 mr-4" />
                                    <div>
                                        <h3 className="text-lg font-bold">KÍNH VẠN HOA</h3>
                                        <p>Thể loại: Tình cảm gia đình, Phiêu Lưu</p>
                                        <p>Số chương: 56 chương</p>
                                        <p>Tình trạng: <span className="text-green-600">Đã hoàn thành</span></p>
                                        <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 mt-5 rounded">CẬP NHẬT</button>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-gray-300 pb-4 mb-4">
                                <div className="flex mb-4">
                                    <img src="https://upload.wikimedia.org/wikipedia/vi/thumb/c/c9/Cho_t%C3%B4i_xin_m%E1%BB%99t_v%C3%A9_%C4%91i_tu%E1%BB%95i_th%C6%A1.jpg/220px-Cho_t%C3%B4i_xin_m%E1%BB%99t_v%C3%A9_%C4%91i_tu%E1%BB%95i_th%C6%A1.jpg" alt="Book cover" className="w-32 h-48 mr-4" />
                                    <div>
                                        <h3 className="text-lg font-bold">CHO TÔI XIN MỘT VÉ ĐI TUỔI THƠ</h3>
                                        <p>Thể loại: Văn học thiếu nhi</p>
                                        <p>Số chương: 12 chương</p>
                                        <p>Tình trạng: <span className="text-green-600">Đã hoàn thành</span></p>
                                        <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 mt-5 rounded">CẬP NHẬT</button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex mb-4">
                                    <img src="https://www.nxbtre.com.vn/Images/Book/NXBTreStoryFull_08352010_033550.jpg" alt="Book cover" className="w-32 h-48 mr-4" />
                                    <div>
                                        <h3 className="text-lg font-bold">TÔI THẤY HOA VÀNG TRÊN CỎ XANH</h3>
                                        <p>Thể loại: Tiểu thuyết dành thiếu niên</p>
                                        <p>Số chương: 81 chương</p>
                                        <p>Tình trạng: <span className="text-green-600">Đã hoàn thành</span></p>
                                        <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 mt-5 rounded">CẬP NHẬT</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <AuthorStickyNote /> */}
                </div> 
        </AuthorRoute>         
  )
}
