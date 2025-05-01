import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import { fetchChaptersByNovelId, createChapter, updateChapter, uploadFile } from '../../services/apiService';
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
<<<<<<< HEAD
  const [newChapter, setNewChapter] = useState({
    chapterNumber: 1,
    title: '',
    content: '',
    price: 0,
    banners: ['', '', ''],
  });
  
=======
  const [newChapter, setNewChapter] = useState({ title: '', content: '', chapterNumber: 1, banners: [null, null, null] });
>>>>>>> 8486a35 (exp + task)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentSource, setContentSource] = useState('write'); 
  const [uploadedFile, setUploadedFile] = useState(null);

  // Quill editor configurations
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
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
        background-color: ${isDarkMode ? '#1E293B' : '#fff'};
      }
      .ql-editor {
        color: ${isDarkMode ? '#ffffff' : '#000000'};
        min-height: 200px;
        max-height: 400px;
      }
      .ql-snow .ql-stroke {
        stroke: ${isDarkMode ? '#ffffff' : '#444444'};
      }
      .ql-snow .ql-fill {
        fill: ${isDarkMode ? '#ffffff' : '#444444'};
      }
      .ql-snow .ql-picker {
        color: ${isDarkMode ? '#ffffff' : '#444444'};
      }
      .ql-snow .ql-picker-options {
        background-color: ${isDarkMode ? '#374151' : '#ffffff'};
        border: 1px solid ${isDarkMode ? '#4B5563' : '#ccc'};
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [isDarkMode]);

  const handleBannerUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Create a temporary chapter to upload the banner
      const tempChapter = {
        idNovel: novel._id,
        title: `Banner ${index + 1}`,
        content: '',
        chapterNumber: 0,
        banners: [null, null, null]
      };
      
      // Update the banner in the temporary chapter
      tempChapter.banners[index] = URL.createObjectURL(file);
      
      // Update the state with the new banner
      const updatedBanners = [...newChapter.banners];
      updatedBanners[index] = tempChapter.banners[index];
      
      setNewChapter(prev => ({
        ...prev,
        banners: updatedBanners
      }));
    } catch (error) {
      console.error('Error uploading banner:', error);
      setError('Có lỗi khi tải lên banner');
    }
  };

  useEffect(() => {
    if (!novel || !novel._id || !loggedInUser) return;

    const fetchChapters = async () => {
      try {
        const data = await fetchChaptersByNovelId(novel._id);
        setChapters(data);
        setFilteredChapters(data);
        setNewChapter(prev => ({ ...prev, chapterNumber: data.length + 1 }));
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    fetchChapters();
  }, [novel, loggedInUser]);

  useEffect(() => {
    setFilteredChapters(chapters.filter(chap => (chap?.title || '').toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, chapters]);

  const handleToggleLock = async (chapterId) => {
    if (loading) return; // Prevent multiple clicks while loading
    
    setLoading(true);
    try {
      const chapterToUpdate = chapters.find(chap => chap._id === chapterId);
      if (!chapterToUpdate) {
        throw new Error('Không tìm thấy chương');
      }

      // Create a copy of the chapter with the new lock status
      const updatedChapter = {
        ...chapterToUpdate,
        isLocked: !chapterToUpdate.isLocked
      };

      // Call API to update
      await updateChapter(chapterId, updatedChapter);

      // Update local state
      const updatedChapters = chapters.map(chap => 
        chap._id === chapterId ? updatedChapter : chap
      );
      
      setChapters(updatedChapters);
      setFilteredChapters(updatedChapters);
    } catch (error) {
      console.error('Error when changing chapter lock status:', error);
      setError('Error occurred when changing chapter lock status');
    } finally {
      setLoading(false);
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
        price: newChapter.price,
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
      console.error('Error creating chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <AuthorSidebar activeView="updateNovel" />
      <main className="w-full md:w-3/4 p-6 space-y-6">
        {/* Novel Card */}
        <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <img src={novel.imageUrl} alt="Book cover" className="w-48 h-64 object-cover rounded-lg shadow-md mx-auto md:mx-0" />
            <div>
              <h1 className="text-3xl font-bold">{novel.title}</h1>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <p><span className="text-gray-500">Thể loại:</span> {novel.idCategories?.map(cat => cat.titleCategory).join(', ')}</p>
                <p><span className="text-gray-500">Trạng thái:</span> <span className="font-semibold text-green-600">{novel.status || 'Đang cập nhật'}</span></p>
                <p><span className="text-gray-500">Số chương:</span> {chapters.length}</p>
                <p><span className="text-gray-500">Lượt xem:</span> {novel.view || 0}</p>
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
  className={`flex items-center gap-2 px-5 py-2.5 rounded-md shadow-md transition-all duration-300 text-sm sm:text-base font-medium ${
    isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
  }`}
>
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
  <span>Thêm Chương</span>
</button>
        </div>

        {/* Chapters Table */}
        <div className={`rounded-lg shadow-lg overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="min-w-full text-left border-separate border-spacing-0">
            <thead className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
              <tr>
                <th className="p-4">STT</th>
                <th className="p-4">Tên Chương</th>
                <th className="p-4">Lượt Xem</th>
                <th className="p-4">Thao Tác</th>
                <th className="p-4">Khóa Chương</th>
              </tr>
            </thead>
            <tbody>
              {filteredChapters.map((chapter, index) => (
                <tr key={chapter._id} className={`${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{chapter.title}</td>
                  <td className="p-4">{chapter.view || 0}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => navigate('/chapter', { state: { chapter } })}
                      className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                      Cập Nhật
                    </button>
                  </td>
                  <td className="p-5">
                    <button 
                      onClick={() => handleToggleLock(chapter._id)}
                      className={`relative items-center inline-flex h-6 w-11 rounded-full transition ${chapter.isLocked ? 'bg-green-500' : 'bg-gray-400'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full transition ${chapter.isLocked ? 'translate-x-6' : 'translate-x-1'} bg-white`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Create Chapter Modal */}
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

<<<<<<< HEAD
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
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Giá chương (VNĐ)
                      <span className="text-gray-500 ml-1">(nếu chương này có thu phí)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newChapter.price}
                      onChange={(e) => setNewChapter({ ...newChapter, price: parseInt(e.target.value) || 0 })}
                      className={`w-full p-2 rounded-lg border ${
                        isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
                      }`}
                      placeholder="Nhập giá chương (0 nếu miễn phí)"
                    />
                  </div>
=======
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
>>>>>>> 8486a35 (exp + task)
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
    </div>
  );
}