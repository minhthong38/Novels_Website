import React, { useContext, useEffect, useState } from "react";
import { UserContext } from '../../context/UserContext';
import { fetchCategories, createNovel } from '../../services/apiService';
import AuthorSidebar from '../sidebar/AuthorSidebar';

function CreateNovel() {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
      // Sử dụng _id nếu có, nếu không thì dùng id
      const userId = loggedInUser._id || loggedInUser.id;
      const newNovel = {
        title,
        description,
        idCategories: selectedCategories,
        idUser: userId,
        imageUrl: defaultCoverImage,
        view: 0,
        rate: 0
      };

      console.log('novelData gửi đi:', newNovel);

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
      // Hiển thị lỗi chi tiết nếu có phản hồi từ backend
      if (error && error.response && error.response.data) {
        setError(
          error.response.data.message || JSON.stringify(error.response.data)
        );
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('Không thể tạo truyện. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để tạo truyện mới.</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-red-500'} min-h-screen`}>
      <AuthorSidebar activeView="createNovel" />
      <main className="w-full md:w-3/4 p-6">
        <div className={`p-3 rounded-lg mb-6 text-center ${isDarkMode ? 'bg-red-700/80 border-red-600' : 'bg-red-100 border-red-300 text-red-700'} text-sm font-medium border`}>
          Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Left Column - Cover Image */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className={`w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border`}>
              <img 
                src={defaultCoverImage} 
                alt="Default cover" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">ẢNH BÌA MẶC ĐỊNH</p>
          </div>
          
          {/* Right Column - Form */}
          <div className="md:col-span-2 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-600 dark:text-gray-300">TIÊU ĐỀ</label>
              <input
                type="text"
                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} text-base`}
                placeholder="Nhập tiêu đề truyện"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-600 dark:text-gray-300">THỂ LOẠI</label>
              {loading ? (
                <div className="py-3 flex justify-center">
                  <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => handleCategoryChange(category._id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium ${selectedCategories.includes(category._id)
                        ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        : isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.name || category.titleCategory}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-600 dark:text-gray-300">GIỚI THIỆU</label>
              <textarea
                className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} min-h-[120px]`}
                placeholder="Nhập nội dung giới thiệu..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            {/* Messages */}
            {error && (
              <div className={`p-3 rounded-lg text-sm ${isDarkMode ? 'bg-red-600/90 text-red-100' : 'bg-red-100 text-red-700'} font-medium border ${isDarkMode ? 'border-red-500' : 'border-red-300'}`}>
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className={`p-3 rounded-lg text-sm ${isDarkMode ? 'bg-green-600/90 text-green-100' : 'bg-green-100 text-green-700'} font-medium border ${isDarkMode ? 'border-green-500' : 'border-green-300'}`}>
                {successMessage}
              </div>
            )}
            
            {/* Submit */}
            <button
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-base mt-4 ${isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-500' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${loading ? 'opacity-70' : ''}`}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'ĐANG XỬ LÝ...' : 'TẠO TRUYỆN'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateNovel;
