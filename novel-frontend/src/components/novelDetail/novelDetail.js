import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import Recommend from '../Recommend/recommend'; // Import Recommend component
import { fetchChaptersByNovelId, addExpToReader, createReadingHistory, toggleFavorite } from '../../services/apiService'; // Import API services

export default function NovelDetail() {
  const [activePart, setActivePart] = useState(null);
  const [novel, setNovel] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [parts, setParts] = useState([]); // Replace static parts with state
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();
  const { novelID } = useParams();
  const { isDarkMode, loggedInUser } = useContext(UserContext);

  useEffect(() => {
    const fetchNovelDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/novels/${novelID}`);
        const novelData = response.data.data;
        novelData.Views += 1; // Increment the views count
        setNovel(novelData);

        // Fetch chapters for the novel
        const chapters = await fetchChaptersByNovelId(novelID);
        setParts(chapters.map((chapter) => ({ label: chapter.title, id: chapter._id }))); // Include chapter ID
      } catch (err) {
        setError('Không thể lấy thông tin tiểu thuyết.');
      } finally {
        setLoading(false);
      }
    };
    fetchNovelDetails();
  }, [novelID]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (loggedInUser?._id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/favorites/check/${loggedInUser._id}/${novelID}`);
          setIsFavorited(response.data.isFavorited);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };
    checkFavoriteStatus();
  }, [loggedInUser, novelID]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  const handlePartClick = async (label) => {
    const selectedChapter = parts.find((part) => part.label === label);
    if (selectedChapter && loggedInUser?.id) {
      try {
        // 👇 Gọi API cộng EXP
        await addExpToReader(loggedInUser.id);
  
        // 👇 Tạo lịch sử đọc
        await createReadingHistory({
          idUser: loggedInUser.id,
          idNovel: novelID,
          idChapter: selectedChapter.id,
          lastReadAt: new Date()
        });
  
        // 👉 Điều hướng tới chương
        navigate(`/novelView/${novelID}?chapterId=${selectedChapter.id}`);
      } catch (error) {
        console.error('Lỗi khi cộng EXP hoặc tạo lịch sử đọc:', error);
        navigate(`/novelView/${novelID}?chapterId=${selectedChapter.id}`);
      }
    } else if (selectedChapter) {
      navigate(`/novelView/${novelID}?chapterId=${selectedChapter.id}`);
    }
  };

  const glowEffect = {
    boxShadow: "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #00f, 0 0 50px #00f, 0 0 60px #00f, 0 0 70px #00f",
    color: "#fff",
    borderRadius: "5px",
    transition: "all 0.3s ease-in-out",
    padding: "8px 16px"
  };
  

  const handleReadBookClick = async () => {
    try {
      if (loggedInUser && loggedInUser.id) {
        console.log('Gọi API cộng EXP...');
        await addExpToReader(loggedInUser.id);
  
        const selectedChapter = parts.find((part) => part.label === activePart) || parts[0];
  
        if (selectedChapter) {
          await createReadingHistory({
            idUser: loggedInUser.id,
            idNovel: novelID,
            idChapter: selectedChapter.id,
            lastReadAt: new Date()
          });
  
          navigate(`/novelView/${novelID}?chapterId=${selectedChapter.id}`);
        } else {
          navigate(`/novelView/${novelID}`);
        }
      } else {
        alert('Vui lòng đăng nhập để đọc sách.');
      }
    } catch (error) {
      console.error('Lỗi khi đọc sách:', error);
    }
  };
  
  
  const handleFavoriteClick = async () => {
    if (!loggedInUser) {
      alert('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    try {
      await toggleFavorite(loggedInUser._id, novelID);
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Có lỗi xảy ra khi thay đổi trạng thái yêu thích');
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: comments.length + 1,
      username: loggedInUser.username,
      avatar: loggedInUser.img,
      text: newComment,
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditedCommentText(comment.text);
  };

  const handleSaveEditedComment = (id) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, text: editedCommentText } : comment
      )
    );
    setEditingComment(null);
    setEditedCommentText('');
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const categoryName = novel.idCategories?.map((cat) => cat.titleCategory).join(', ') || 'Chưa cập nhật';
  const author = novel.idUser;

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="w-full p-12">
        {novel && (
          <>
            <div
              className="bg-gradient-to-r from-indigo-600 via-purple-800 to-blue-500 text-white p-6 rounded-lg flex flex-col items-center md:flex-row md:items-start shadow-lg"
            >
              <div className="flex-1 flex flex-col items-center md:flex-row md:items-start">
                <img
                  src={novel.imageUrl}
                  alt={`Book cover with title '${novel.title}'`}
                  className="w-48 h-64 mb-4 md:mb-0 md:mx-0 rounded-lg shadow-md"
                />
                <div className="flex-1 flex flex-col items-center md:items-start md:ml-6 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white">{novel.title}</h1>
                  <p className="text-sm mt-2 text-gray-200">
                    Lượt xem: <span className="font-bold text-yellow-400">{novel.view || 0}</span>
                  </p>
                  <div className="flex items-center justify-center md:justify-start mt-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          onClick={() => handleStarClick(index)}
                          xmlns="http://www.w3.org/2000/svg"
                          fill={index < rating ? 'yellow' : 'gray'}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-lg mt-2 text-gray-300">Trang chủ / Thể loại / {categoryName}</p>
                  <div className="flex items-center justify-center md:justify-start mt-2">
                    {author?.avatar && (
                      <img
                        src={author.avatar}
                        alt={author.fullname}
                        className="w-8 h-8 rounded-full border-2 border-yellow-400 shadow-sm"
                      />
                    )}
                    <div className="ml-2">
                      <p className="font-semibold text-white">{author?.fullname}</p>
                      <p className="text-sm text-gray-400">@{author?.username}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={handleReadBookClick}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg shadow-md"
                    >
                      Đọc sách
                    </button>
                    <button
                      onClick={handleFavoriteClick}
                      className={`px-6 py-3 rounded-lg flex items-center text-lg transition-colors duration-300 shadow-md ${
                        isFavorited
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-black hover:bg-gray-800 text-gray-200'
                      }`}
                    >
                      <i className={`fas fa-heart ${isFavorited ? 'text-white' : 'text-gray-200'}`}></i>
                      {isFavorited ? 'Đã yêu thích' : '❤ Yêu thích'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 mt-6 md:mt-0 md:ml-36 w-full md:w-auto">
                <div className="bg-gradient-to-r from-purple-800 to-indigo-700 p-10 rounded-lg flex justify-center md:justify-start w-full md:w-68 shadow-md">
                  <ul className="text-white text-lg text-left space-y-2">
                    {parts.map((part, index) => (
                      <li key={index}>
                        <button
                          style={activePart === part.label ? glowEffect : null}
                          className="hover:text-yellow-400 transition duration-300 ease-in-out transform"
                          onClick={() => handlePartClick(part.label)}
                        >
                          {part.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-12 flex flex-col md:flex-row ml-0 md:ml-12">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6">GIỚI THIỆU NỘI DUNG</h2>
                <p className="mb-6 text-lg">{novel.description || 'Chưa có mô tả'}</p>
              </div>
              <div className="flex-1 md:ml-12">
                <Recommend 
                  customStyle={{ gridTemplateColumns: 'repeat(2, 1fr)', maxItems: 4 }} 
                  excludeNovelId={novelID} 
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
