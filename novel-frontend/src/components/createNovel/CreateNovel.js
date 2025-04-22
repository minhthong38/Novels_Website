import React, { useContext, useEffect, useState } from "react";
import { UserContext } from '../../context/UserContext';
import { fetchCategories, createNovel } from '../../services/apiService'; // Import API functions
import AuthorSidebar from '../sidebar/AuthorSidebar';

function CreateNovel() {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [ageLimit, setAgeLimit] = useState('');
  const [status, setStatus] = useState('');
  const [categories, setCategories] = useState([]); // Ensure categories is initialized as an array
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const predefinedCategories = [
    { id: 1, name: "Family Drama" },
    { id: 2, name: "Society" },
    { id: 3, name: "Horror" },
    { id: 4, name: "Adventure" },
    { id: 5, name: "Martial Arts" },
    { id: 6, name: "Romance" },
    { id: 7, name: "Sports" },
    { id: 8, name: "Comedy" },
    { id: 9, name: "Detective" },
    { id: 10, name: "Science Fiction" },
  ];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(
          Array.isArray(fetchedCategories) && fetchedCategories.length > 0
            ? fetchedCategories
            : predefinedCategories // Use predefined categories if API returns empty
        );
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(predefinedCategories); // Fallback to predefined categories on error
      }
    };
    loadCategories();
  }, []);

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

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = async () => {
    if (!title || !author || !ageLimit || !status || selectedCategories.length === 0 || !description) {
      alert('Please fill in all required fields!');
      return;
    }

    const newNovel = {
      title,
      description,
      authorId: loggedInUser.id || 1,
      ageLimit,
      status,
      categories: selectedCategories,
      imageUrl: uploadedImage || 'https://via.placeholder.com/150',
    };

    try {
      await createNovel(newNovel);
      setSuccessMessage('Novel created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Reset form fields
      setUploadedImage(null);
      setTitle('');
      setAuthor('');
      setAgeLimit('');
      setStatus('');
      setSelectedCategories([]);
      setDescription('');
    } catch (error) {
      console.error('Error creating novel:', error);
      alert('An error occurred while creating the novel!');
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Please log in to create a new novel.</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <AuthorSidebar activeView="createNovel" />
      <main className="w-full md:w-3/4 p-8">
        <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-700'}`}>
          Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam. Tác giả lưu ý khi đăng tải tác phẩm. Nếu vi phạm bạn có thể bị khóa truyện, nếu tái phạm có thể bị khóa tài khoản vĩnh viễn.
        </div>
        <br />
        <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-green-900 text-white' : 'bg-green-200 text-black'}`}>
          Truyện sau khi có đủ 5 chương mới có thể duyệt. Truyện sau khi gửi yêu cầu duyệt mất từ 1-2 ngày để xem xét. Khi đã duyệt hoặc từ chối bạn sẽ nhận được thông báo.
        </div>
        <br />
        <h1 className="text-2xl font-bold mb-6">Tạo Truyện Mới</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <label htmlFor="image-upload" className="cursor-pointer">
              <img
                src={uploadedImage || 'https://images.icon-icons.com/1875/PNG/512/fileupload_120150.png'}
                alt="Book cover"
                className={`border w-full md:w-60 h-80 px-4 py-2 mb-4 object-cover ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
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
                className={`border-b w-full px-4 py-2 focus:outline-none mb-4 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                placeholder="Nhập tiêu đề truyện tại đây"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className={`border-b w-full px-4 py-2 focus:outline-none mb-4 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                placeholder="Nhập tên tác giả"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Giới Hạn Độ Tuổi</label>
              <select
                className={`border rounded w-full px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
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
                className={`border rounded w-full px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
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
              <h3 className="text-lg font-bold">Novel Categories</h3>
              <p className="text-sm text-gray-500 mb-2">Select up to 10 categories</p>
              <div className={`border p-4 rounded h-80 overflow-y-scroll ${isDarkMode ? 'border-gray-600' : 'border-black'}`}>
                <div className="flex flex-col">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>{category.name}</span>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
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
            className={`border rounded w-full px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
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
