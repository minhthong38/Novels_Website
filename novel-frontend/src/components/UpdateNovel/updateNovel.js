import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import { fetchChaptersByNovelId, createChapter, updateChapter } from '../../services/apiService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import mammoth from 'mammoth';

export default function UpdateNovel() {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const novel = location.state?.novel;
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [showCreateChapter, setShowCreateChapter] = useState(false);
  const [newChapter, setNewChapter] = useState({
    title: '',
    content: '',
    chapterNumber: 1,
    banners: [null, null, null]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentSource, setContentSource] = useState('write'); // 'write' or 'upload'
  const [uploadedFile, setUploadedFile] = useState(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'font',
    'align',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ql-toolbar.ql-snow {
        border: 1px solid ${isDarkMode ? '#4B5563' : '#ccc'};
        background-color: ${isDarkMode ? '#374151' : '#fff'};
      }
      .ql-container.ql-snow {
        border: 1px solid ${isDarkMode ? '#4B5563' : '#ccc'};
        background-color: ${isDarkMode ? '#374151' : '#fff'};
      }
      .ql-editor {
        color: ${isDarkMode ? '#fff' : '#000'};
        min-height: 200px;
        max-height: 400px;
      }
      .ql-snow .ql-stroke {
        stroke: ${isDarkMode ? '#fff' : '#444'};
      }
      .ql-snow .ql-fill {
        fill: ${isDarkMode ? '#fff' : '#444'};
      }
      .ql-snow .ql-picker {
        color: ${isDarkMode ? '#fff' : '#444'};
      }
      .ql-snow .ql-picker-options {
        background-color: ${isDarkMode ? '#374151' : '#fff'};
        border: 1px solid ${isDarkMode ? '#4B5563' : '#ccc'};
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [isDarkMode]);

  useEffect(() => {
    if (!novel || !novel._id || !loggedInUser) return;
  
    const fetchChapters = async () => {
      try {
        const data = await fetchChaptersByNovelId(novel._id);
        setChapters(data);
        setFilteredChapters(data);
        setNewChapter(prev => ({
          ...prev,
          chapterNumber: data.length + 1
        }));
      } catch (error) {
        console.error('Lỗi khi fetch danh sách chương:', error);
      }
    };
  
    fetchChapters();
  }, [novel, loggedInUser]);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = chapters.filter(chap =>
      (chap?.title || '').toLowerCase().includes(lowerSearch)
    );
    setFilteredChapters(filtered);
  }, [searchTerm, chapters]);

  const handleBannerUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newBanners = [...newChapter.banners];
        newBanners[index] = e.target.result;
        setNewChapter({...newChapter, banners: newBanners});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateChapter = async () => {
    if (!newChapter.title.trim() || !newChapter.content.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const fullTitle = `Chương ${newChapter.chapterNumber}: ${newChapter.title}`;
      
      await createChapter({
        idNovel: novel._id,
        title: fullTitle,
        content: newChapter.content,
        chapterNumber: newChapter.chapterNumber,
        banners: newChapter.banners || [null, null, null]
      });
      
      const updatedChapters = await fetchChaptersByNovelId(novel._id);
      setChapters(updatedChapters);
      setFilteredChapters(updatedChapters);
      
      const nextChapterNumber = updatedChapters.length + 1;
      setNewChapter({
        title: '',
        content: '',
        chapterNumber: nextChapterNumber,
        banners: [null, null, null]
      });
      setShowCreateChapter(false);
      setError('');
    } catch (error) {
      setError('Có lỗi xảy ra khi tạo chương mới');
      console.error('Lỗi khi tạo chương:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      setError('Vui lòng chọn file Word (.docx)');
      return;
    }

    setUploadedFile(file);
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      let html = result.value;
      
      // Xử lý HTML
      html = html
        .replace(/<p>/g, '') // Loại bỏ thẻ <p>
        .replace(/<\/p>/g, '<br/>') // Thay thế </p> bằng <br/>
        .replace(/<br\/><br\/>/g, '<br/>') // Loại bỏ <br/> trùng lặp
        .replace(/^\s+|\s+$/g, ''); // Loại bỏ khoảng trắng đầu và cuối
      
      setNewChapter(prev => ({ ...prev, content: html }));
      setError('');
    } catch (error) {
      setError('Không thể đọc file Word. Vui lòng thử lại.');
      console.error('Lỗi khi đọc file Word:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async (chapterId) => {
    if (loading) return; // Prevent multiple clicks while loading
    
    setLoading(true);
    try {
      const chapterToUpdate = chapters.find(chap => chap._id === chapterId);
      if (!chapterToUpdate) {
        throw new Error('Không tìm thấy chương');
      }

      // Tạo bản sao của chương với trạng thái khóa mới
      const updatedChapter = {
        ...chapterToUpdate,
        isLocked: !chapterToUpdate.isLocked
      };

      // Gọi API cập nhật
      await updateChapter(chapterId, updatedChapter);

      // Cập nhật state local
      const updatedChapters = chapters.map(chap => 
        chap._id === chapterId ? updatedChapter : chap
      );
      
      setChapters(updatedChapters);
      setFilteredChapters(updatedChapters);
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái khóa chương:', error);
      setError('Có lỗi xảy ra khi thay đổi trạng thái khóa chương');
    } finally {
      setLoading(false);
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để cập nhật truyện.</div>;
  }

  if (!novel) {
    return <div className="text-center mt-10">Không tìm thấy thông tin truyện.</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <AuthorSidebar activeView="updateNovel" />
      <main className="w-full md:w-3/4 p-4">
        {/* Novel Info Card */}
        <div className={`rounded-lg shadow-lg p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img 
              src={novel.imageUrl} 
              alt="Book cover" 
              className="w-48 h-64 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{novel.title}</h1>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Thể loại:</p>
                  <p className="font-semibold">
                    {Array.isArray(novel.idCategories)
                      ? novel.idCategories.map(cat => 
                          typeof cat === 'object' && cat !== null && cat.titleCategory 
                            ? cat.titleCategory 
                            : cat
                        ).join(', ')
                      : novel.idCategories}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Tình trạng:</p>
                  <p className="font-semibold text-green-600">{novel.status || 'Đang cập nhật'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Số chương:</p>
                  <p className="font-semibold">{chapters.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Lượt xem:</p>
                  <p className="font-semibold">{novel.view || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Tìm kiếm chương..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-black border-gray-300'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={() => setShowCreateChapter(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm Chương Mới
          </button>
        </div>

        {/* Chapters Table */}
        <div className={`rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="min-w-full">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <tr>
                <th className="py-4 px-6 text-left">STT</th>
                <th className="py-4 px-6 text-left">Tên Chương</th>
                <th className="py-4 px-6 text-left">Lượt Xem</th>
                <th className="py-4 px-6 text-left">Thao Tác</th>
                <th className="py-4 px-6 text-left">Khóa Chương</th>
              </tr>
            </thead>
            <tbody>
              {filteredChapters.map((chapter, index) => (
                <tr 
                  key={chapter._id}
                  className={`border-t ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <td className="py-4 px-6">{index + 1}</td>
                  <td className="py-4 px-6">{chapter.title}</td>
                  <td className="py-4 px-6">{chapter.view || 0}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => navigate('/chapter', { state: { chapter } })}
                      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      Cập Nhật
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleToggleLock(chapter._id)}
                        disabled={loading}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer ${
                          chapter.isLocked 
                            ? isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'
                            : isDarkMode ? 'bg-gray-500' : 'bg-gray-200'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full transition-transform duration-300 ${
                            isDarkMode ? 'bg-gray-300' : 'bg-white'
                          } ${chapter.isLocked ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {chapter.isLocked ? 'Đã khóa' : 'Mở khóa'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Chapter Popup */}
        {showCreateChapter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-4 rounded-lg shadow-lg max-w-3xl w-full mx-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Thêm Chương Mới</h3>
                <button 
                  onClick={() => setShowCreateChapter(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Số chương
                      <span className="text-red-500 ml-1">(thông tin bắt buộc)</span>
                    </label>
                    <input
                      type="text"
                      value={`Chương ${newChapter.chapterNumber}:`}
                      className={`w-full p-2 rounded-lg border ${
                        isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
                      }`}
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tên chương
                      <span className="text-red-500 ml-1">(thông tin bắt buộc)</span>
                    </label>
                    <input
                      type="text"
                      value={newChapter.title}
                      onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
                      className={`w-full p-2 rounded-lg border ${
                        isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
                      }`}
                      placeholder="Nhập tên chương"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nội dung chương
                    <span className="text-red-500 ml-1">(thông tin bắt buộc)</span>
                  </label>
                  
                  {/* Tùy chọn nguồn nội dung */}
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setContentSource('write')}
                      className={`px-4 py-2 rounded-lg ${
                        contentSource === 'write'
                          ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Tự viết
                    </button>
                    <button
                      onClick={() => setContentSource('upload')}
                      className={`px-4 py-2 rounded-lg ${
                        contentSource === 'upload'
                          ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Upload Word
                    </button>
                  </div>

                  {/* Hiển thị trình soạn thảo hoặc upload */}
                  {contentSource === 'write' ? (
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg overflow-hidden`}>
                      <ReactQuill
                        theme="snow"
                        value={newChapter.content}
                        onChange={(content) => setNewChapter({...newChapter, content})}
                        modules={modules}
                        formats={formats}
                        className="h-64"
                      />
                    </div>
                  ) : (
                    <div className={`p-4 border-2 border-dashed rounded-lg ${
                      isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                    }`}>
                      <input
                        type="file"
                        accept=".docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="word-upload"
                      />
                      <label
                        htmlFor="word-upload"
                        className={`block text-center cursor-pointer ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {uploadedFile ? (
                          <div>
                            <p className="mb-2">File đã chọn: {uploadedFile.name}</p>
                            <button
                              onClick={() => setUploadedFile(null)}
                              className={`px-3 py-1 rounded ${
                                isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
                              }`}
                            >
                              Xóa file
                            </button>
                          </div>
                        ) : (
                          <div>
                            <svg
                              className="mx-auto h-12 w-12 mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p>Kéo thả file Word vào đây hoặc click để chọn file</p>
                            <p className="text-sm mt-2">Chỉ hỗ trợ file .docx</p>
                          </div>
                        )}
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Banner cho chương (3 ảnh)
                    <span className="text-gray-500 ml-1">(nếu có)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBannerUpload(index, e)}
                          className="hidden"
                          id={`banner-upload-${index}`}
                        />
                        <label
                          htmlFor={`banner-upload-${index}`}
                          className={`block w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer ${
                            isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {newChapter.banners[index] ? (
                            <img 
                              src={newChapter.banners[index]} 
                              alt={`Banner ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="mt-2 text-sm">Tải lên banner {index + 1}</p>
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowCreateChapter(false)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-black'
                    }`}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateChapter}
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Đang tạo...' : 'Tạo Chương'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
