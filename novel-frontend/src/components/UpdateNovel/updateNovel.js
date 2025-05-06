import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import { fetchChaptersByNovelId, createChapter, updateChapter, uploadFile, updateNovel, fetchNovelContent } from '../../services/apiService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import mammoth from 'mammoth';

export default function UpdateNovel() {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [novel, setNovel] = useState(location.state?.novel || {});
  const [loadingNovel, setLoadingNovel] = useState(true);

  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [showCreateChapter, setShowCreateChapter] = useState(false);

  const [newChapter, setNewChapter] = useState({ title: '', content: '', chapterNumber: 1, price: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentSource, setContentSource] = useState('write'); 
  const [uploadedFile, setUploadedFile] = useState(null);
  const [status, setStatus] = useState(novel?.status || 'ongoing');

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

  useEffect(() => {
    if (location.state?.novel) {
      setNovel(location.state.novel);
      setLoadingNovel(false);
    } else {
      // Fetch novel details if not passed through location state
      const fetchNovelDetails = async () => {
        try {
          const response = await fetchNovelContent(location.state?.novelId);
          setNovel(response.data);
        } catch (error) {
          console.error('Error fetching novel details:', error);
        } finally {
          setLoadingNovel(false);
        }
      };
      fetchNovelDetails();
    }
  }, [location.state?.novel]);

  const handleWordUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const result = await mammoth.extractRawText({arrayBuffer: event.target.result});
        setNewChapter({...newChapter, content: result.value});
        setContentSource('word');
      } catch (error) {
        setError('Lỗi khi đọc file Word');
        console.error('Error reading Word file:', error);
      }
    };
    reader.readAsArrayBuffer(file);
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
        price: newChapter.price
      });
      
      const updatedChapters = await fetchChaptersByNovelId(novel._id);
      setChapters(updatedChapters);
      setFilteredChapters(updatedChapters);
      
      const nextChapterNumber = updatedChapters.length + 1;
      setNewChapter({
        title: '',
        content: '',
        chapterNumber: nextChapterNumber,
        price: 0
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

  const handleUpdateNovel = async () => {
    if (!novel || !novel._id) return;
    try {
      setLoading(true);
      const updatedNovel = {
        ...novel,
        status
      };
      await updateNovel(novel._id, updatedNovel);
      setNovel((prev) => ({ ...prev, status })); // Update only the status in the state
      alert('Trạng thái truyện đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating novel:', error);
      setError('Failed to update novel status');
    } finally {
      setLoading(false);
    }
  };

  if (loadingNovel) {
    return <div>Loading novel details...</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <AuthorSidebar activeView="updateNovel" />
      <main className="w-full md:w-3/4 p-6 space-y-6">
        {/* Novel Card */}
        <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img src={novel.imageUrl} alt="Book cover" className="w-48 h-64 object-cover rounded-xl shadow-lg border border-gray-200 dark:border-gray-700" />
            <div className="flex-1 w-full">
              <h2 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-300">{novel.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 mb-6">
                <div>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Thể loại:</span>
                  <span className="ml-2">{Array.isArray(novel.idCategories) ? novel.idCategories.map(cat => typeof cat === 'object' && cat !== null && cat.titleCategory ? cat.titleCategory : cat).join(', ') : novel.idCategories}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Số chương:</span>
                  <span className="ml-2">{chapters.length}</span>
                </div>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="block text-lg font-medium">
                    Trạng thái truyện
                    <span className="text-red-500 ml-1">(bắt buộc)</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`p-2 rounded-lg border w-56 ${
                      isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
                    }`}
                  >
                    <option value="ongoing">Đang tiến hành</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="hiatus">Tạm ngưng</option>
                  </select>
                  <button
                    onClick={handleUpdateNovel}
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-150 ${
                      isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Đang cập nhật...' : 'Cập nhật Trạng Thái'}
                  </button>
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md shadow-md transition-all duration-300 text-sm sm:text-base font-medium ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Thêm Chương</span>
          </button>
        </div>

        {/* Chapters Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">STT</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[180px]">TÊN CHƯƠNG</th>
                  <th className="px-8 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredChapters.map((chapter, index) => (
                  <tr key={chapter._id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-sm font-medium">
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-1">
                        {chapter.title}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="hidden sm:inline">Cập nhật: </span>
                        {new Date(chapter.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => navigate('/chapter', { state: { chapter } })}
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      >
                        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* Create Chapter Modal */}
      {showCreateChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className={`w-full max-w-2xl rounded-xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600">
              {/* Fixed Header */}
              <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Tạo Chương Mới</h3>
                  <button 
                    onClick={() => setShowCreateChapter(false)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className={`max-h-[60vh] overflow-y-auto p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="space-y-4">
                  {/* Chapter Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Số chương
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        value={newChapter.chapterNumber}
                        onChange={(e) => setNewChapter({...newChapter, chapterNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tiêu đề chương
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={newChapter.title}
                        onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Nhập tiêu đề chương"
                      />
                    </div>
                  </div>

                  {/* Chapter Price Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Giá chương (VNĐ)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newChapter.price || ''}
                        onChange={(e) => setNewChapter({...newChapter, price: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Nhập giá chương"
                        required
                      />
                    </div>
                  </div>

                  {/* Content Source Section */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Nguồn nội dung
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <div className="flex-1">
                        <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${contentSource === 'write' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                          <div className="text-center">
                            <input
                              type="radio"
                              name="contentSource"
                              value="write"
                              checked={contentSource === 'write'}
                              onChange={() => setContentSource('write')}
                              className="hidden"
                            />
                            <svg className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Viết trực tiếp</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Soạn nội dung bằng trình biên tập</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="flex-1">
                        <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${contentSource === 'word' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                          <div className="text-center">
                            <input
                              type="radio"
                              name="contentSource"
                              value="word"
                              checked={contentSource === 'word'}
                              onChange={() => setContentSource('word')}
                              className="hidden"
                            />
                            <svg className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0112.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Tải lên file Word</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nhập nội dung từ file .doc/.docx</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  
                    {contentSource === 'word' && (
                      <div className="mb-4">
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 015.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                              <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <span>Tải lên file</span>
                                <input 
                                  type="file" 
                                  accept=".doc,.docx" 
                                  onChange={handleWordUpload}
                                  className="sr-only"
                                />
                              </label>
                              <p className="pl-1">hoặc kéo thả vào đây</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              DOC, DOCX (tối đa 10MB)
                            </p>
                          </div>
                        </div>
                        {newChapter.content && (
                          <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Đã tải lên thành công! Nội dung đã sẵn sàng.
                          </div>
                        )}
                      </div>
                    )}

                    {contentSource === 'write' && (
                      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600`}>
                        <ReactQuill
                          theme="snow"
                          value={newChapter.content}
                          onChange={(content) => setNewChapter({...newChapter, content})}
                          modules={modules}
                          formats={formats}
                          className="h-64"
                          placeholder="Nhập nội dung chương tại đây..."
                        />
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-900 rounded-lg">
                      {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed Footer */}
              <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Action Buttons */}
                <div className="mt-8 pt-5">
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      onClick={() => setShowCreateChapter(false)}
                      className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center
                        ${isDarkMode 
                          ? 'border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Hủy bỏ
                    </button>
                    
                    <button
                      onClick={handleCreateChapter}
                      disabled={loading}
                      className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center
                        ${isDarkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'}
                        ${loading ? 'opacity-70 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Tạo Chương
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}