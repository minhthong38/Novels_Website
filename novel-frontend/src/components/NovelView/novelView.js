import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchChaptersByNovelId, fetchChapterContent } from '../../services/apiService';

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
  const [bookmarkedLines, setBookmarkedLines] = useState([]); // State for bookmarked lines

  const banners = [
    '/images/banner1.jpg',
    '/images/banner2.jpg',
    '/images/banner3.jpg',
  ];

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const chapterList = await fetchChaptersByNovelId(novelID);
        setChapters(chapterList);

        const chapterId = searchParams.get('chapterId');
        if (chapterId) {
          const index = chapterList.findIndex((chapter) => chapter._id === chapterId);
          setCurrentChapterIndex(index !== -1 ? index : 0);
        } else {
          setCurrentChapterIndex(0);
        }
      } catch (err) {
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
    setBookmarkedLines(savedBookmarks);
  }, [novelID, currentChapterIndex]);

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
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

  const handleLineBookmarkToggle = (lineIndex) => {
    const updatedBookmarks = bookmarkedLines.includes(lineIndex)
      ? bookmarkedLines.filter((index) => index !== lineIndex) // Remove bookmark
      : [...bookmarkedLines, lineIndex]; // Add bookmark

    setBookmarkedLines(updatedBookmarks);
    localStorage.setItem(`bookmarks_${novelID}_${currentChapterIndex}`, JSON.stringify(updatedBookmarks));
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner Section */}
      <div className="relative h-64 bg-cover bg-center transition-all duration-1000" style={{ backgroundImage: `url(${banners[bannerIndex]})` }}>
        {/* Left Navigation Button */}
        <button
          onClick={() => handleBannerNavigation('prev')}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          &#8249;
        </button>

        {/* Right Navigation Button */}
        <button
          onClick={() => handleBannerNavigation('next')}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          &#8250;
        </button>

        {/* Dots for Manual Control */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full ${index === bannerIndex ? 'bg-white' : 'bg-gray-400'} hover:bg-gray-200`}
            ></button>
          ))}
        </div>
      </div>

      {/* Chapter Content */}
      <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-3xl font-bold text-center mb-4">{chapters[currentChapterIndex]?.title}</h1>
        <div className="prose max-w-none text-justify text-lg leading-relaxed">
          {chapterContent.split('\n').map((line, index) => (
            <div
              key={index}
              className={`flex items-center ${bookmarkedLines.includes(index) ? 'bg-yellow-100' : ''}`}
              onClick={() => handleLineBookmarkToggle(index)} // Add onClick to the line container
              title={bookmarkedLines.includes(index) ? 'Remove Bookmark' : 'Add Bookmark'}
            >
              <p className="flex-1 cursor-pointer">{line}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mt-6">
        <button
          onClick={handlePreviousChapter}
          disabled={currentChapterIndex === 0}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50"
        >
          Chương trước
        </button>
        <button
          onClick={handleNextChapter}
          disabled={currentChapterIndex === chapters.length - 1}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50"
        >
          Chương sau
        </button>
      </div>
    </div>
  );
}
