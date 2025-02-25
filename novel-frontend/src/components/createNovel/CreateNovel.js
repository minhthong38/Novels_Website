import React from "react";
import AuthorRoute from "../routes/AuthorRoute"; 
// import AuthorStickyNote from "../AuthorStickyNote";

function CreateNovel() {
  return (
    <AuthorRoute>
      <main className="w-full p-8">
        <div className="bg-red-200 text-red-700 text-center py-3 font-semibold text-sm p-4">
          Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật
          Việt Nam. Tác giả lưu ý khi đăng tải tác phẩm. Nếu vi phạm bạn có thể
          bị khóa truyện, nếu tái phạm có thể bị khóa tài khoản vĩnh viễn.
        </div>
        <br></br>
        <div className="bg-green-200 text-black text-center py-3 font-semibold text-sm p-4">
          Truyện sau khi có đủ 5 chương mới có thể duyệt. Truyện sau khi gửi yêu
          cầu duyệt mất từ 1-2 ngày để xem xét. Khi đã duyệt hoặc từ chối bạn sẽ
          nhận được thông báo.
        </div>
        <br></br>
        <h1 className="text-2xl font-bold mb-6">Tạo Truyện Mới</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <img
              src="https://product.hstatic.net/200000343865/product/3_a5616d63a4fa46009957e368765318c1_master.jpg"
              alt="Admin Avatar"
              className="border w-full md:w-60 h-80 px-4 py-2 mb-4"
            />
            <button className="bg-green-500 text-white px-8 py-2 rounded shadow-md hover:bg-green-600 w-full md:w-auto">
              Chọn Ảnh Bìa
            </button>
          </div>

          {/* Left Section */}
          <div className="flex flex-col">
            <div className="mb-4">
              <input
                type="text"
                className="border-b border-gray-400 w-full px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Nhập tiêu đề truyện tại đây"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="border-b border-gray-400 w-full px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Nhập tên tác giả"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Giới Hạn Độ Tuổi</label>
              <select className="border rounded w-full px-4 py-2">
                <option value=""></option>
                <option value="1">16+</option>
                <option value="2">18+</option>
                <option value="3">20+</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Tình Trạng</label>
              <select className="border rounded w-full px-4 py-2">
                <option value=""></option>
                <option value="1">Đang cập nhật</option>
                <option value="2">Đã hoàn thành</option>
                <option value="2">Sắp ra mắt</option>
              </select>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Phân Loại Truyện</h3>
              <p className="text-sm text-gray-500 mb-2">Tối đa 10 phân loại</p>
              <div className="border border-black p-4 rounded h-80 overflow-y-scroll">
                <div className="flex flex-col">
                  {[
                    "Tình Cảm Gia Đình",
                    "Xã Hội",
                    "Kinh Dị",
                    "Phiêu Lưu",
                    "Kiếm Hiệp",
                    "Ngôn Tình",
                    "Thể Thao",
                    "Hài Hước",
                    "Trinh Thám",
                    "Viễn Tưởng",
                    "Lịch Sử",
                    "Thiếu Nhi",
                  ].map((category) => (
                    <div
                      key={category}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>{category}</span>
                      <input type="checkbox" id={category} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="mt-8">
          <label className="block font-bold mb-2">Giới Thiệu</label>
          <textarea
            className="border rounded w-full px-4 py-2"
            rows="6"
          ></textarea>
        </div>

        <button className="bg-red-500 text-white px-6 py-2 rounded shadow-md hover:bg-red-600 mt-6 w-full md:w-auto">
          Lưu Thay Đổi
        </button>
        {/* <AuthorStickyNote /> */}
      </main>
    </AuthorRoute>
  );
}

export default CreateNovel;
