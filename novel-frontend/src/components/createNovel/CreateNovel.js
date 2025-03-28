import React, { useContext, useEffect, useState } from "react";
import { UserContext } from '../../context/UserContext';
import { novels } from '../../data/data';

function CreateNovel() {
  const { loggedInUser } = useContext(UserContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [ageLimit, setAgeLimit] = useState('');
  const [status, setStatus] = useState('');
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    console.log('loggedInUser:', loggedInUser);
  }, [loggedInUser]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    document.getElementById("image-upload").click();
  };

  const handleCategoryChange = (category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = () => {
    if (!title || !author || !ageLimit || !status || categories.length === 0 || !description) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newNovel = {
      NovelID: novels.length + 1,
      Title: title,
      Description: description,
      AuthorID: loggedInUser.id || 1,
      Views: 0,
      CategoryID: categories.join(', '),
      Created_at: new Date().toISOString(),
      Updated_at: new Date().toISOString(),
      ImageUrl: uploadedImage || 'https://via.placeholder.com/150',
    };

    novels.push(newNovel);
    setSuccessMessage('Tạo truyện thành công!');
    setTimeout(() => setSuccessMessage(''), 3000);

    // Reset form fields
    setUploadedImage(null);
    setTitle('');
    setAuthor('');
    setAgeLimit('');
    setStatus('');
    setCategories([]);
    setDescription('');
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để tạo truyện mới.</div>;
  }

  return (
    <div className="flex">
      <main className="w-3/4 p-8">
        <div className="bg-red-200 text-red-700 text-center py-3 font-semibold text-sm p-4">
          Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật
          Việt Nam. Tác giả lưu ý khi đăng tải tác phẩm. Nếu vi phạm bạn có thể
          bị khóa truyện, nếu tái phạm có thể bị khóa tài khoản vĩnh viễn.
        </div>
        <br />
        <div className="bg-green-200 text-black text-center py-3 font-semibold text-sm p-4">
          Truyện sau khi có đủ 5 chương mới có thể duyệt. Truyện sau khi gửi yêu
          cầu duyệt mất từ 1-2 ngày để xem xét. Khi đã duyệt hoặc từ chối bạn sẽ
          nhận được thông báo.
        </div>
        <br />
        <h1 className="text-2xl font-bold mb-6">Tạo Truyện Mới</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <label htmlFor="image-upload" className="cursor-pointer">
              <img
                src={uploadedImage || 'https://images.icon-icons.com/1875/PNG/512/fileupload_120150.png'}
                alt="Book cover"
                className="border w-full md:w-60 h-80 px-4 py-2 mb-4 object-cover"
              />
            </label>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              className="bg-green-500 text-white px-8 py-2 rounded shadow-md hover:bg-green-600 w-full md:w-auto"
              onClick={triggerFileUpload}
            >
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="border-b border-gray-400 w-full px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Nhập tên tác giả"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Giới Hạn Độ Tuổi</label>
              <select
                className="border rounded w-full px-4 py-2"
                value={ageLimit}
                onChange={(e) => setAgeLimit(e.target.value)}
              >
                <option value=""></option>
                <option value="16+">16+</option>
                <option value="18+">18+</option>
                <option value="20+">20+</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Tình Trạng</label>
              <select
                className="border rounded w-full px-4 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value=""></option>
                <option value="Đang cập nhật">Đang cập nhật</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Sắp ra mắt">Sắp ra mắt</option>
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
                      <input
                        type="checkbox"
                        checked={categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <button
          className="bg-red-500 text-white px-6 py-2 rounded shadow-md hover:bg-red-600 mt-6 w-full md:w-auto"
          onClick={handleSave}
        >
          Lưu Thay Đổi
        </button>

        {successMessage && (
          <div className="mt-4 text-green-500 font-bold">{successMessage}</div>
        )}
      </main>
    </div>
  );
}

export default CreateNovel;
