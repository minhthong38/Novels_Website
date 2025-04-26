import React, { useContext, useEffect, useState } from "react";
import { UserContext } from '../../context/UserContext';
import { fetchCategories, createNovel } from '../../services/apiService';
import AuthorSidebar from '../sidebar/AuthorSidebar';

function CreateNovel() {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Default cover image
  const defaultCoverImage = 'https://imgur.com/zOuGi1m.jpg';

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('Fetching categories...');
        const response = await fetchCategories();
        console.log('Categories response:', response);
        
        if (response && Array.isArray(response)) {
          setCategories(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Invalid categories data format:', response);
          setError('Không thể tải danh mục. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      }
    };
    loadCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = async () => {
    if (!title || !description || selectedCategories.length === 0) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      const newNovel = {
        title,
        description,
        idCategories: selectedCategories,
        idUser: loggedInUser._id,
        status,
        imageUrl: defaultCoverImage,
        view: 0,
        rate: 0
      };

      const response = await createNovel(newNovel);
      setSuccessMessage('Tạo truyện thành công!');
      setTimeout(() => {
        setSuccessMessage('');
        // Reset form
        setTitle('');
        setDescription('');
        setSelectedCategories([]);
      }, 3000);
    } catch (error) {
      console.error('Error creating novel:', error);
      setError('Không thể tạo truyện. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để tạo truyện mới.</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <AuthorSidebar activeView="createNovel" />
      <main className="w-full md:w-3/4 p-8">
        <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-700'}`}>
          Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam. Tác giả lưu ý khi đăng tải tác phẩm.
        </div>
        
        <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-green-900 text-white' : 'bg-green-200 text-black'}`}>
          Truyện sau khi có đủ 5 chương mới có thể duyệt. Truyện sau khi gửi yêu cầu duyệt mất từ 1-2 ngày để xem xét.
        </div>

        <h1 className="text-2xl font-bold mb-6">Tạo Truyện Mới</h1>

        {/* Author Info */}
        <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h2 className="text-lg font-semibold mb-2">Thông tin tác giả</h2>
          <div className="flex items-center space-x-4">
            <img 
              src={loggedInUser.avatar || 'https://via.placeholder.com/150'} 
              alt="Author avatar" 
              className="w-16 h-16 rounded-full"
            />
            <div>
              <p className="font-semibold">{loggedInUser.fullName || loggedInUser.username}</p>
              <p className="text-sm text-gray-500">{loggedInUser.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cover Image Section */}
          <div className="flex flex-col items-center">
            <div className={`relative w-full md:w-60 h-80 border-2 rounded-lg overflow-hidden ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <img
                src={defaultCoverImage}
                alt="Default book cover"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">Ảnh bìa mặc định</p>
          </div>

          {/* Basic Info Section */}
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block font-bold mb-2">Tiêu đề</label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-black border-gray-300'
                }`}
                placeholder="Nhập tiêu đề truyện"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Tình trạng</label>
              <select
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-black border-gray-300'
                }`}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="ongoing">Đang cập nhật</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="hiatus">Tạm ngưng</option>
              </select>
            </div>
          </div>

          {/* Categories Section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-2">Thể loại</h3>
            {categories.length === 0 ? (
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className="text-center">Đang tải thể loại...</p>
              </div>
            ) : (
              <>
                <div className={`border rounded-lg p-4 h-80 overflow-y-auto ${
                  isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                }`}>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((category) => (
                      <label
                        key={category._id}
                        className={`flex items-center p-2 rounded-lg cursor-pointer ${
                          selectedCategories.includes(category._id)
                            ? isDarkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-500 text-white'
                            : isDarkMode
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleCategoryChange(category._id)}
                        />
                        {category.name || category.titleCategory}
                      </label>
                    ))}
                  </div>
                </div>
                {selectedCategories.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Đã chọn: {selectedCategories.length} thể loại</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedCategories.map(categoryId => {
                        const category = categories.find(c => c._id === categoryId);
                        return category ? (
                          <span 
                            key={categoryId}
                            className={`px-2 py-1 rounded-full text-sm ${
                              isDarkMode 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {category.name || category.titleCategory}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-8">
          <label className="block font-bold mb-2">Giới thiệu</label>
          <textarea
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white text-black border-gray-300'
            }`}
            rows="6"
            placeholder="Nhập nội dung giới thiệu truyện"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-100 text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-4 rounded-lg bg-green-100 text-green-700">
            {successMessage}
          </div>
        )}

        {/* Save Button */}
        <button
          className={`mt-6 px-6 py-3 rounded-lg font-bold ${
            isDarkMode 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Đang tạo...' : 'Tạo Truyện'}
        </button>
      </main>
    </div>
  );
}

export default CreateNovel;
