import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchChaptersByNovelId, fetchChapterContent, addExpToReader } from '../../services/apiService';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

export default function NovelView() {
  const { novelID } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [chapterContent, setChapterContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bookmarkedParagraphs, setBookmarkedParagraphs] = useState([]); // State for bookmarked paragraphs
  const [banners, setBanners] = useState([]); // Update banners to be dynamic
  const [showExpNotification, setShowExpNotification] = useState(false);
  const { loggedInUser } = useContext(UserContext);

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
    const savedBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${novelID}_${currentChapterIndex}`)) || [];
    setBookmarkedParagraphs(savedBookmarks);
  }, [novelID, currentChapterIndex]);

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

  const handleParagraphBookmarkToggle = (paraIndex) => {
    const updatedBookmarks = bookmarkedParagraphs.includes(paraIndex)
      ? [] // Remove bookmark (only one allowed so clear all)
      : [paraIndex]; // Set new bookmark (only one allowed)

    setBookmarkedParagraphs(updatedBookmarks);
    localStorage.setItem(`bookmarks_${novelID}_${currentChapterIndex}`, JSON.stringify(updatedBookmarks));
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

  // Split content into paragraphs instead of lines
  const paragraphs = chapterContent.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white relative">
      {/* Banner Section */}
      <div className="relative h-72 bg-cover bg-center transition-all duration-1000 shadow-lg" style={{ backgroundImage: `url(${banners[bannerIndex] || '/images/default-banner.jpg'})` }}> {/* Use default image if no banners */}
        {/* Left Navigation Button */}
        <button
          onClick={() => handleBannerNavigation('prev')}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
        >
          &#8249;
        </button>

        {/* Right Navigation Button */}
        <button
          onClick={() => handleBannerNavigation('next')}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
        >
          &#8250;
        </button>

        {/* Dots for Manual Control */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setBannerIndex(index)} // Update bannerIndex when a dot is clicked
              className={`w-4 h-4 rounded-full ${index === bannerIndex ? 'bg-white' : 'bg-gray-400'} hover:bg-gray-200 transition`}
            ></button>
          ))}
        </div>
      </div>

      {/* Chapter Content */}
      <div className="p-5 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-black">{chapters[currentChapterIndex]?.title}</h1>
        <div className="prose max-w-none text-justify text-lg leading-relaxed space-y-4">
          {paragraphs.map((paragraph, index) => (
            <div
              key={index}
              className={`flex items-center p-2 rounded-md ${bookmarkedParagraphs.includes(index) ? 'bg-yellow-100' : ''} hover:bg-gray-100 transition`}
              onClick={() => handleParagraphBookmarkToggle(index)}
              title={bookmarkedParagraphs.includes(index) ? 'Remove Bookmark' : 'Add Bookmark (only one allowed)'}
            >
              <p className="flex-1 cursor-pointer" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\n/g, '<br/>') }}></p>
              {bookmarkedParagraphs.includes(index) && (
                <span className="text-yellow-500 font-bold ml-2">★</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center max-w-4xl mx-auto m-10">
        <button
          onClick={handlePreviousChapter}
          disabled={currentChapterIndex === 0}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 transition"
        >
          Chương trước
        </button>
        <button
          onClick={handleNextChapter}
          disabled={currentChapterIndex === chapters.length - 1}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 transition"
        >
          Chương sau
        </button>
      </div>

      {/* EXP Notification */}
      {showExpNotification && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-50">
          <div className="flex items-center">
            <span className="text-lg font-bold mr-2">+10 EXP</span>
            <span className="text-2xl">✨</span>
          </div>
        </div>
      )}
    </div>
  );
}
