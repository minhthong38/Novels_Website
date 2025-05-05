import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import Recommend from '../Recommend/recommend'; // Import Recommend component
import { fetchChaptersByNovelId, addExpToReader, 
  createReadingHistory, toggleFavorite,fetchFavoriteNovels,
  addComment, fetchCommentsByNovel, deleteComment, submitRating, fetchRatingsByNovel,deleteRating
,fetchUserRatingForNovel } from '../../services/apiService'; // Import API services
import {buyChapter} from '../../services/apiService'; // Import buyChapter service
import { checkChapterPurchased, createPurchaseHistory } from '../../services/apiService';
import { fetchUserDetails } from '../../services/apiService';
import { getWallet } from '../../services/apiService';

export default function NovelDetail() {
  const [activePart, setActivePart] = useState(null);
  const [novel, setNovel] = useState({});
  const [favorites, setFavorites] = useState([]);
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
  //rating
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingData, setRatingData] = useState({ average: 0, total: 0 });
  const [userRating, setUserRating] = useState(0);
  const [status, setStatus] = useState('');

  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [pendingChapter, setPendingChapter] = useState(null);

  //rating
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratings = await fetchRatingsByNovel(novelID); // Sử dụng hàm từ apiService
        
        // Tính tổng số lượt đánh giá
        const totalRatings = ratings.length;
  
        // Tính điểm trung bình
        const totalRatingPoints = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        const averageRating = totalRatings > 0 ? totalRatingPoints / totalRatings : 0;
  
        // Cập nhật trạng thái
        setAverageRating(averageRating);
        setTotalRatings(totalRatings);
  
        // Kiểm tra nếu người dùng đã đánh giá
        if (loggedInUser) {
          const existing = ratings.find(r => r.idUser._id === loggedInUser._id);
          if (existing) {
            setUserRating(existing.rating);
            setRating(existing.rating); // Để hiển thị highlight sao
          }
        }
  
      } catch (err) {
        console.error('Không thể lấy thông tin đánh giá', err);
      }
    };
  
    fetchRatings();
  }, [novelID, loggedInUser]);

  useEffect(() => {
    const getUserRating = async () => {
      console.log("loggedInUser in rating", loggedInUser);
      
      if (loggedInUser) {
        try {
          const res = await fetchUserRatingForNovel(novelID, loggedInUser._id || loggedInUser.id);
          console.log("res in rating", res);
          
          if (res?.rating) {
            setUserRating(res.rating);
            setRating(res.rating); // để highlight sao
          }
        } catch (err) {
          console.log('User chưa đánh giá hoặc lỗi khi lấy rating:', err);
        }
      }
    };
    getUserRating();
  }, [novelID, loggedInUser]);
  
  //comment
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchCommentsByNovel(novelID);
        console.log('Bình luận:', data); // Kiểm tra dữ liệu bình luận
        
        
        // Thêm thông tin người dùng vào mỗi bình luận nếu cần
        const enrichedComments = data.map(comment => ({
          ...comment,
          avatar: comment.idUser ? comment.idUser.avatar : null,
          fullname: comment.idUser ? comment.idUser.fullname : 'Người dùng ẩn danh',
        }));        
    
        setComments(enrichedComments);  // Cập nhật state với bình luận đã được thêm thông tin người dùng
      } catch (error) {
        console.error('Lỗi khi tải bình luận:', error);
        setError('Lỗi khi tải bình luận.');
      }
    };      
    loadComments();
  }, [novelID]); 
    

  useEffect(() => {
    const fetchNovelDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/novels/${novelID}`);
        const novelData = response.data.data;
        novelData.Views += 1; // Increment the views count
        setNovel(novelData);
        setStatus(novelData.status);

        // Fetch chapters for the novel
        const chapters = await fetchChaptersByNovelId(novelID);
        setParts(chapters.map((chapter) => ({ label: chapter.title, id: chapter._id, price: chapter.price || 0 }))); // Include chapter ID
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
      const userId = loggedInUser?._id || loggedInUser?.id;
      console.log("loggedInUser in checkFavoriteStatus", loggedInUser);
      
      if (!userId) return;
  
      try {
        const favorites = await fetchFavoriteNovels(userId);
        const isNovelFavorited = favorites.some(fav => fav.idNovel?._id === novelID);
        console.log('Favorite status:', isNovelFavorited);
        setIsFavorited(isNovelFavorited);
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
      }
    };
  
    checkFavoriteStatus();
  }, [loggedInUser?._id, novelID]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !loggedInUser) return;
  
    try {
      // Gửi bình luận đến API
      const user = loggedInUser._id || loggedInUser.id;
      const response = await addComment(novelID, user, newComment);
      console.log('Kết quả gửi bình luận:', response); // Kiểm tra phản hồi từ API
      
      
  
      if (response.success && response.data && response.data._id) {
        // Thêm thông tin người dùng vào bình luận
        const newCommentData = {
          ...response.data,
          fullname: loggedInUser.fullname,  // Thêm tên người dùng
          avatar: loggedInUser.avatar,      // Thêm hình ảnh người dùng
        };
  
        // Cập nhật lại state comments với bình luận mới
        setComments([newCommentData, ...comments]);
        setNewComment(''); // Reset lại ô nhập bình luận
      } else {
        setError('Không thể thêm bình luận');
      }
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
      setError('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
  
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error('Lỗi khi xóa bình luận:', error);
    }
  };

  const glowEffect = {
    boxShadow: "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #00f, 0 0 50px #00f, 0 0 60px #00f, 0 0 70px #00f",
    color: "#fff",
    borderRadius: "5px",
    transition: "all 0.3s ease-in-out",
    padding: "8px 16px"
  };
  
  const handleReadChapter = async (chapter) => {
    const userId = loggedInUser?._id || loggedInUser?.id;
    const isAuthor = userId === novel?.idUser?._id;
  
    try {
      if (chapter.price > 0 && !isAuthor) {
        const hasPurchased = await checkChapterPurchased(userId, chapter.id || chapter._id);
        if (!hasPurchased) {
          // 👉 Hiển thị popup và lưu chương đang chờ xác nhận
          setPendingChapter(chapter);
          setShowPurchasePopup(true);
          return;
        }
      }
  
      await proceedToReadChapter(chapter); // ✅ nếu miễn phí hoặc đã mua
    } catch (err) {
      console.error('Lỗi khi xử lý đọc chương:', err);
      alert('Đã xảy ra lỗi khi đọc chương.');
    }
  };

  const handleConfirmPurchase = async () => {
    const chapter = pendingChapter;
    const userId = loggedInUser?._id || loggedInUser?.id;
  
    try {
      const token = localStorage.getItem('token');
      const user = await fetchUserDetails(token);
      const wallet = await getWallet(user._id, token);
      const currentCoins = wallet?.wallet?.balance;
  
      if (currentCoins < chapter.price) {
        setShowPurchasePopup(false);
        alert('Bạn không đủ coin để mua chương này.');
        setPendingChapter(null);
        return;
      }
  
      const result = await buyChapter({
        idUser: userId,
        idChapter: chapter.id || chapter._id,
        idNovel: novelID,
        price: chapter.price,
      });
  
      if (!result.success) {
        alert('Không thể mua chương. Vui lòng thử lại.');
        return;
      }
  
      await createPurchaseHistory({
        idUser: userId,
        idChapter: chapter.id || chapter._id,
        idNovel: novelID,
        price: chapter.price,
        purchaseDate: new Date(),
      });
  
      await proceedToReadChapter(chapter);
      setShowPurchasePopup(false);
      setPendingChapter(null);
    } catch (err) {
      console.error('Lỗi khi mua chương:', err);
      alert('Đã xảy ra lỗi khi mua chương.');
    }
  };
  

  const proceedToReadChapter = async (chapter) => {
    const userId = loggedInUser?._id || loggedInUser?.id;
    await addExpToReader(userId);
    await createReadingHistory({
      idUser: userId,
      idNovel: novelID,
      idChapter: chapter.id || chapter._id,
      lastReadAt: new Date(),
    });
    navigate(`/novel/${novelID}/read?chapterId=${chapter.id || chapter._id}`);
  };

  const handlePartClick = async (label) => {
    const selected = parts.find((part) => part.label === label);
    if (!selected) return;
  
    setSelectedChapter(selected);
    await handleReadChapter(selected);
  };
  
  const handleReadBookClick = async () => {
    try {
      const chapters = await fetchChaptersByNovelId(novelID);
      if (chapters && chapters.length > 0) {
        const firstChapter = chapters[0];
        await handleReadChapter(firstChapter);
      } else {
        setError('Không tìm thấy chương nào');
      }
    } catch (err) {
      console.error('Error reading book:', err);
      setError('Có lỗi xảy ra khi mở sách');
    }
  };
  

  const handleFavoriteClick = async () => {
    const userId = loggedInUser._id || loggedInUser.id;

    if (!userId || !novelID) {
      alert('Thiếu thông tin người dùng hoặc tiểu thuyết');
      return;
    }

    console.log("Gọi toggleFavorite với:", loggedInUser._id, novelID);
  
    try {
      await toggleFavorite(userId, novelID);
      // Cập nhật trạng thái ngay lập tức
      setIsFavorited(!isFavorited);
      
      // Kiểm tra lại trạng thái từ server sau 1 giây
      setTimeout(async () => {
        const favorites = await fetchFavoriteNovels(userId);
        const isNovelFavorited = favorites.some(fav => fav.idNovel?._id === novelID);
        setIsFavorited(isNovelFavorited);
      }, 1000);
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái yêu thích:', error);
    }
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

  // Xử lý rating
  const handleStarClick = async (index) => {
    const selectedRating = index + 1;
  
    if (!loggedInUser?.id && !loggedInUser?._id) {
      alert('Vui lòng đăng nhập để đánh giá!');
      return;
    }
  
    const userId = loggedInUser.id || loggedInUser._id;
  
    try {
      if (userRating > 0) {
        const confirm = window.confirm('Bạn đã đánh giá truyện này. Bạn có muốn đánh giá lại không?');
        if (!confirm) return;
  
        // Xóa đánh giá cũ
        await deleteRating(novelID, userId);
      } else {
        const confirm = window.confirm('Bạn có muốn đánh giá truyện này không?');
        if (!confirm) return;
      }
  
      // Gửi rating mới
      await submitRating(novelID, userId, selectedRating);
  
      // Lấy lại danh sách rating để cập nhật UI
      const updatedRatings = await fetchRatingsByNovel(novelID);
      const total = updatedRatings.length;
      const sum = updatedRatings.reduce((acc, item) => acc + item.rating, 0);
      const avg = total > 0 ? sum / total : 0;
  
      setRating(selectedRating);
      setUserRating(selectedRating);
      setAverageRating(avg);
      setTotalRatings(total);
      
      alert('Cảm ơn bạn đã đánh giá!');
    } catch (err) {
      console.error('Lỗi khi gửi đánh giá:', err);
    }
  };
  

  const categoryName = novel.idCategories?.map((cat) => cat.titleCategory).join(', ') || 'Chưa cập nhật';
  const author = novel.idUser;

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="w-full p-12">
        {novel && (
          <>
            <div className="bg-gradient-to-r from-indigo-600 via-purple-800 to-blue-500 text-white p-6 rounded-lg flex flex-col items-center md:flex-row md:items-start shadow-lg">
              <div className="flex-1 flex flex-col items-center md:flex-row md:items-start">
                <img
                  src={novel.imageUrl}
                  alt={`Book cover with title '${novel.title}'`}
                  className="w-48 h-64 mb-4 md:mb-0 md:mx-0 rounded-lg shadow-md"
                />
                <div className="flex-1 flex flex-col items-center md:items-start md:ml-6 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white">{novel.title}</h1>
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          onClick={() => handleStarClick(index)}
                          xmlns="http://www.w3.org/2000/svg"
                          fill={index < rating ? 'yellow' : 'gray'}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6 cursor-pointer"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-yellow-300 text-sm">
                      {averageRating ? averageRating.toFixed(1) : 'Chưa có đánh giá'} / 5 ({totalRatings ? totalRatings : 0} đánh giá)
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-gray-200">
                    Lượt xem: <span className="font-bold text-yellow-400">{novel.view || 0}</span>
                  </p>
                  <p className="text-sm mt-2 text-gray-200">
                    Trạng thái: <span className="font-bold text-yellow-400">{status}</span>
                  </p>
                  <p className="text-lg mt-2 text-gray-300"> Thể loại / {categoryName}</p>
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
                      <span className="ml-2">{isFavorited ? 'Đã yêu thích' : '❤ Yêu thích'}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 mt-6 md:mt-0 md:ml-36 w-full md:w-auto">
                <div className="bg-gradient-to-r from-purple-800 to-indigo-700 p-10 rounded-lg flex justify-center md:justify-start w-full md:w-68 shadow-md overflow-y-auto max-h-64">
                <ul className="text-white text-lg text-left space-y-2">
                  {parts.map((part, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <button
                        style={activePart === part.label ? glowEffect : null}
                        className="hover:text-yellow-400 transition duration-300 ease-in-out transform flex items-center gap-1"
                        onClick={() => handlePartClick(part.label)}
                      >
                        {part.label}
                        {part.price > 0 && <span title="Chương tính phí">💰</span>}
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
                <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Bình luận</h3>
                {loggedInUser ? (
                  <div className="mb-4">
                    <textarea
                      className="w-full p-2 border rounded text-black"
                      rows="3"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Viết bình luận..."
                    />
                    <button
                      onClick={handleCommentSubmit}
                      className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Gửi bình luận
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-400">Vui lòng đăng nhập để bình luận.</p>
                )}

                <ul className="space-y-4">
                {comments.map((comment) => {
                  console.log('comment nè :' , comment);  // Kiểm tra cấu trúc của mỗi comment
                  console.log("loggedInUser nè :", loggedInUser);
                  return (
                    <li key={comment._id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
                      <div className="flex items-center mb-2">
                        <img
                          src={comment.avatar || '/default-avatar.png'}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="font-semibold text-sm">{comment.fullname || 'Ẩn danh'}</span>
                        {(loggedInUser._id || loggedInUser.id) === (comment.idUser?._id || comment.idUser) && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="ml-auto text-red-500 hover:text-red-700 text-sm"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </li>
                  );
                })}

                </ul>
              </div>
              </div>
              <div className="flex-1 md:ml-12">
                <Recommend
                  customStyle={{ gridTemplateColumns: 'repeat(2, 1fr)', maxItems: 4 }}
                  excludeNovelId={novelID}
                />
              </div>
            </div>
            <div className="mt-4">
            </div>
          </>
        )}

        {showPurchasePopup && pendingChapter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Mua chương {pendingChapter.title}</h2>
              <p className="mb-4">
                Bạn có muốn mua chương <strong>{pendingChapter.title}</strong> với giá{' '}
                <strong>{pendingChapter.price} xu</strong> để tiếp tục đọc?
              </p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
                  onClick={() => {
                    setShowPurchasePopup(false);
                    setPendingChapter(null);
                  }}
                >
                  Hủy
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                  onClick={handleConfirmPurchase} // ✅ Gọi đúng hàm xử lý thanh toán
                >
                  Mua và đọc
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  }  