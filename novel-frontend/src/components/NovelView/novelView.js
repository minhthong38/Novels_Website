import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { fetchChaptersByNovelId, fetchChapterContent, addExpToReader } from '../../services/apiService';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function NovelView() {
  // Theme mode state
  const [themeMode, setThemeMode] = useState('light');
  const handleThemeToggle = (mode) => setThemeMode(mode);
  const { novelID } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [chapterContent, setChapterContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bookmarkedParagraph, setBookmarkedParagraph] = useState(null);
  const [banners, setBanners] = useState([]); // Update banners to be dynamic
  const [showExpNotification, setShowExpNotification] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const chapterList = await fetchChaptersByNovelId(novelID);
        if (!chapterList || chapterList.length === 0) {
          throw new Error('Danh sách chương trống hoặc không tồn tại.');
        }
        setChapters(chapterList);

        const chapterId = searchParams.get('chapterId'); // Get chapterId from query parameters
        if (chapterId) {
          const index = chapterList.findIndex((chapter) => chapter._id === chapterId);
          setCurrentChapterIndex(index !== -1 ? index : 0); // Navigate to the correct chapter
        } else {
          setCurrentChapterIndex(0);
        }
      } catch (err) {
        console.error('Error loading chapters:', err);
        setError('Không thể tải danh sách chương.');
      } finally {
        setLoading(false);
      }
    };
    loadChapters();
  }, [novelID, searchParams]);

  useEffect(() => {
    const loadChapterContent = async () => {
      if (chapters.length === 0) return;
      try {
        const chapter = chapters[currentChapterIndex];
        const content = await fetchChapterContent(chapter._id);
        setChapterContent(content.content);
        localStorage.setItem(`checkpoint_${novelID}`, currentChapterIndex);
        
        // Hiển thị thông báo EXP khi load chapter
        if (loggedInUser) {
          setShowExpNotification(true);
          setTimeout(() => setShowExpNotification(false), 2000);
        }
      } catch (err) {
        setError('Không thể tải nội dung chương.');
      }
    };
    loadChapterContent();
  }, [chapters, currentChapterIndex, novelID]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    const userID = loggedInUser?._id || loggedInUser?.id || '';
    const savedBookmark = localStorage.getItem(`bookmark_${userID}_${novelID}_${currentChapterIndex}`);
    setBookmarkedParagraph(savedBookmark ? parseInt(savedBookmark) : null);
    
    // Auto-scroll to bookmark when coming from history
    if (savedBookmark && location.state?.scrollToBookmark) {
      setTimeout(() => {
        const element = document.querySelector(`[data-bookmark-index="${savedBookmark}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [novelID, currentChapterIndex, location.state, loggedInUser]);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const chapterList = await fetchChaptersByNovelId(novelID);
        const firstBannerImage = chapterList[currentChapterIndex]?.imageUrl || '/images/default-banner.jpg'; // Use the current chapter's imageUrl or a default image
        setBanners([firstBannerImage, '/images/banner2.jpg', '/images/banner3.jpg']); // Set the first banner dynamically
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };
    loadBanners();
  }, [novelID, currentChapterIndex]);

  const getParagraphs = () => {
    if (!chapterContent) return [];
    
    // Xử lý HTML
    if (chapterContent.includes('<')) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(chapterContent, 'text/html');
      return Array.from(doc.body.children)
        .filter(el => ['P', 'DIV', 'BLOCKQUOTE'].includes(el.tagName))
        .filter(el => el.textContent.trim() !== '')
        .map(el => ({
          innerHTML: el.innerHTML,
          textContent: el.textContent
        }));
    }
    
    // Xử lý text thuần
    return chapterContent.split('\n\n')
      .filter(text => text.trim() !== '')
      .map(text => ({
        innerHTML: text.replace(/\n/g, '<br/>'),
        textContent: text
      }));
  };

  const handleParagraphBookmark = (index) => {
    const para = paragraphs[index];
    if (!para.textContent.trim()) return;
    
    const newBookmark = bookmarkedParagraph === index ? null : index;
    setBookmarkedParagraph(newBookmark);
    const userID = loggedInUser?._id || loggedInUser?.id || '';
    localStorage.setItem(`bookmark_${userID}_${novelID}_${currentChapterIndex}`, newBookmark);
  };

  const paragraphs = getParagraphs();

  const handleNextChapter = async () => {
    if (currentChapterIndex < chapters.length - 1) {
      try {
        if (loggedInUser && loggedInUser._id) {
          await addExpToReader(loggedInUser._id);
          setShowExpNotification(true);
          setTimeout(() => setShowExpNotification(false), 2000);
        }
        setCurrentChapterIndex(currentChapterIndex + 1);
      } catch (err) {
        console.error('Không thể cộng EXP:', err);
        setError('Có lỗi xảy ra khi cộng EXP.');
      }
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      if (loggedInUser) {
        setShowExpNotification(true);
        setTimeout(() => setShowExpNotification(false), 2000);
      }
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleBannerNavigation = (direction) => {
    if (direction === 'prev') {
      setBannerIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    } else if (direction === 'next') {
      setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }
  };

  const handleDotClick = (index) => {
    setBannerIndex(index);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
      <p className="text-gray-600">Đang tải nội dung chương...</p>
      <p className="text-sm text-gray-500 mt-2">NovelID: {novelID}</p>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header + Theme Toggle */}
      <div className={`sticky top-0 z-10 shadow-sm py-2 px-4 flex flex-col gap-2 ${themeMode === 'dark' ? 'bg-gray-900' : themeMode === 'read' ? 'bg-yellow-100' : 'bg-white'}`}>
        <div className="flex justify-between items-center">
          <button 
            onClick={handleBackClick}
            className={`flex items-center ${themeMode === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Quay lại
          </button>
          <h2 className={`text-lg font-medium text-center flex-1 ${themeMode === 'dark' ? 'text-white' : 'text-black'}`}>{chapters[currentChapterIndex]?.title}</h2>
          <div className="w-8"></div> {/* For balance */}
        </div>
        {/* Theme Mode Toggle */}
        <div className="flex gap-2 justify-center items-center mt-1">
          <button
            onClick={() => handleThemeToggle('light')}
            className={`px-3 py-1 rounded ${themeMode === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} transition`}
          >Light</button>
          <button
            onClick={() => handleThemeToggle('dark')}
            className={`px-3 py-1 rounded ${themeMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} transition`}
          >Dark</button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-y-auto px-4 pb-4 transition-colors duration-300 ${
        themeMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
      }`}>
        <div className="max-w-3xl mx-auto space-y-4">
          {paragraphs.map((para, index) => (
            <div
              key={index}
              data-bookmark-index={index}
              className={`relative p-4 rounded-lg border-l-4 ${
                bookmarkedParagraph === index
                  ? (themeMode === 'dark' ? 'bg-gray-700 border-gray-400' : 'bg-blue-50 border-blue-400')
                  : (themeMode === 'dark' ? 'border-transparent hover:bg-gray-700' : 'border-transparent hover:bg-gray-50')
              } transition-all`}
              onClick={() => handleParagraphBookmark(index)}
            >
              <div 
                className="content"
                dangerouslySetInnerHTML={{ __html: para.innerHTML }} 
              />
              {bookmarkedParagraph === index && (
                <div className={`absolute -right-2 -top-2 rounded-full w-6 h-6 flex items-center justify-center ${themeMode === 'dark' ? 'bg-gray-600 text-white' : 'bg-blue-400 text-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exp notification */}
      {showExpNotification && (
        <div className="fixed bottom-20 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          +10 EXP đã được cộng!
        </div>
      )}

      {/* Chapter navigation */}
      <div className={`sticky bottom-0 border-t py-2 px-4 ${themeMode === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex justify-between max-w-3xl mx-auto">
          <button 
            onClick={handlePreviousChapter}
            disabled={currentChapterIndex === 0}
            className={`px-4 py-2 rounded disabled:opacity-50 ${themeMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}
          >
            Chương trước
          </button>
          <button 
            onClick={handleNextChapter}
            disabled={currentChapterIndex === chapters.length - 1}
            className={`px-4 py-2 rounded disabled:opacity-50 ${themeMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}
          >
            Chương tiếp
          </button>
        </div>
      </div>
    </div>
  );
}
