import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchChapterContent, updateChapter } from '../../services/apiService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Chapter() {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
    const loadChapter = async () => {
      if (!location.state?.chapter?._id) {
        setError('Không tìm thấy thông tin chương');
        setLoading(false);
        return;
      }

      try {
        const chapterData = await fetchChapterContent(location.state.chapter._id);
        setChapter(chapterData);
        setError('');
      } catch (error) {
        setError('Không thể tải nội dung chương');
        console.error('Lỗi khi tải chương:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [location.state?.chapter?._id]);

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
        height: 800px;
      }
      .ql-editor {
        color: ${isDarkMode ? '#fff' : '#000'};
        min-height: 800px;
        font-size: 1.125rem;
        line-height: 1.75;
        font-family: 'Inter', sans-serif;
        overflow-y: auto;
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
      .ql-editor p {
        margin-bottom: 1rem;
      }
      .ql-editor blockquote {
        border-left: 4px solid ${isDarkMode ? '#4B5563' : '#ccc'};
        margin: 1rem 0;
        padding-left: 1rem;
        color: ${isDarkMode ? '#9CA3AF' : '#666'};
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [isDarkMode]);

  const handleBannerUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newBanners = [...(chapter?.banners || [null, null, null])];
        newBanners[index] = e.target.result;
        setChapter(prev => ({ ...prev, banners: newBanners }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!chapter.title.trim() || !chapter.content.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSaving(true);
    try {
      const response = await updateChapter(chapter._id, {
        title: chapter.title,
        content: chapter.content,
        banners: chapter.banners
      });

      if (response) {
        setError('');
        alert('Cập nhật chương thành công!');
        navigate(-1);
      } else {
        throw new Error('Không nhận được phản hồi từ server');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật chương');
      console.error('Lỗi khi cập nhật chương:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để chỉnh sửa chương.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <AuthorSidebar activeView="chapter" />
      <main className="w-full md:w-3/4 p-8">
        <div className={`p-4 rounded mb-4 ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
          Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam.
        </div>
        <div className={`p-5 max-w-7xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg`}>
          <h1 className="text-4xl font-bold text-center mb-6">{chapter?.title || 'Chỉnh Sửa Chương'}</h1>
          
          {error && (
            <div className={`p-4 mb-4 rounded-lg ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
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
                    {chapter?.banners?.[index] ? (
                      <img 
                        src={chapter.banners[index]} 
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

          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg overflow-hidden`}>
            <ReactQuill
              theme="snow"
              value={chapter?.content || ''}
              onChange={(content) => setChapter(prev => ({ ...prev, content }))}
              modules={modules}
              formats={formats}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
