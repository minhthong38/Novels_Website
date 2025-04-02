import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { novels, categories, users } from '../../data/data'; // Adjust the import path as needed
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function NovelDetail() {
  const [activePart, setActivePart] = useState(null);
  const [novel, setNovel] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);  // Add this line
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(''); // State for the new comment input
  const [editingComment, setEditingComment] = useState(null); // State for editing a comment
  const [editedCommentText, setEditedCommentText] = useState(''); // State for the edited comment text
  const [rating, setRating] = useState(0); // State for the star rating
  const navigate = useNavigate();
  const { novelID } = useParams();
  const { isDarkMode, loggedInUser } = useContext(UserContext); // Get dark mode state and logged-in user from context

  useEffect(() => {
    const selectedNovel = novels.find(novel => novel.NovelID === parseInt(novelID));
    if (selectedNovel) {
      selectedNovel.Views += 1; // Increment the views count
      setNovel({ ...selectedNovel });
    }
  }, [novelID]);

  const parts = [
    { label: 'Phần 1' },
    { label: 'Phần 2' },
    { label: 'Phần 3' },
    { label: 'Phần 4' },
  ];

  const handlePartClick = (label) => {
    setActivePart(label);
  };

  const glowEffect = {
    boxShadow: "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #00f, 0 0 50px #00f, 0 0 60px #00f, 0 0 70px #00f",
    color: "#fff",
    borderRadius: "5px",
    transition: "all 0.3s ease-in-out",
    padding: "8px 16px"
  };

  const handleReadBookClick = () => {
    const historyKey = `checkpoint_${novelID}`;
    if (!localStorage.getItem(historyKey)) {
      localStorage.setItem(historyKey, JSON.stringify(null)); // Save to history without a bookmark
    }
    navigate(`/novelView/${novelID}`);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return; // Prevent empty comments
    const comment = {
      id: comments.length + 1,
      username: loggedInUser.username,
      avatar: loggedInUser.img,
      text: newComment,
    };
    setComments([comment, ...comments]); // Add new comment to the top
    setNewComment(''); // Clear the input field
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter(comment => comment.id !== id)); // Remove the comment by ID
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id); // Set the comment to be edited
    setEditedCommentText(comment.text); // Set the initial text for editing
  };

  const handleSaveEditedComment = (id) => {
    setComments(
      comments.map(comment =>
        comment.id === id ? { ...comment, text: editedCommentText } : comment
      )
    );
    setEditingComment(null); // Exit editing mode
    setEditedCommentText(''); // Clear the edited text
  };

  const handleStarClick = (index) => {
    setRating(index + 1); // Set the rating based on the clicked star
  };

  const categoryName = categories.find(category => category.CategoryID === novel.CategoryID)?.CategoryName;
  const author = users.find(user => user.UserID === novel.AuthorID);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="w-full p-12">
        {novel && (
          <>
            <div className="bg-blue-700 text-white p-6 rounded-lg flex flex-col md:flex-row">
              <div className="flex-1 flex flex-col md:flex-row md:items-start">
                <img src={novel.ImageUrl} alt={`Book cover with title '${novel.Title}'`} className="w-48 h-64 mb-4 md:mb-0" />
                <div className="flex-1 flex flex-col items-center md:items-start md:ml-6">
                  <h1 className="text-2xl font-bold">{novel.Title}</h1>
                  <p className="text-sm mt-2">Lượt xem: <span className="font-bold">{novel.Views}</span></p>
                  <div className="flex items-center mt-2">
                    {/* Star Rating */}
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
                  <p className="text-lg mt-2">Trang chủ / Thể loại / {categoryName}</p>
                  <div className="flex items-center mt-2">
                    <Link to="/authors" className="flex items-center">
                      <img src="https://i.imgur.com/Y0N4tO3.png" alt="User icon" className="w-8 h-8" />
                      <span className="ml-2 underline text-lg">{author?.Username}</span>
                    </Link>
                    <button className="flex items-center ml-6 focus:outline-none">
                      <img src="https://i.imgur.com/E1RJHdo.png" alt="Heart icon" className="w-8 h-8" />
                      <span className="ml-2 underline text-lg">Yêu thích</span>
                    </button>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleReadBookClick}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg mr-4 mb-5 text-lg"
                    >
                      Đọc sách
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 mt-6 md:mt-0 md:ml-36">
                <div className="bg-blue-800 p-10 rounded-lg flex w-68">
                  <ul className="text-white text-lg text-left space-y-2">
                    {parts.map((part) => (
                      <li key={part.label}>
                        <button
                          style={activePart === part.label ? glowEffect : null}
                          className="hover:text-amber-500 transition duration-300 ease-in-out transform"
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
                <p className="mb-6 text-lg">{novel.Description}</p>
              </div>
              <div className="flex-1 mt-12 md:mt-0 md:ml-12">
                <h2 className="text-2xl font-bold mb-6">SÁCH ĐỀ XUẤT</h2>
                <div className="flex items-center mb-6">
                  <Link to="/novelDetail/tư-duy-ngược" className="flex items-center">
                    <img src="https://i.imgur.com/OoGAP3P.png" alt="Book cover with title 'Tư duy ngược'" className="w-32 h-48" />
                    <span className="ml-4 text-xl">TƯ DUY NGƯỢC</span>
                  </Link>
                </div>
                <div className="flex items-center">
                  <Link to="/novelDetail/đắc-nhân-tâm" className="flex items-center">
                    <img src="https://i.imgur.com/dPSZ21C.png" alt="Book cover with title 'Đắc nhân tâm'" className="w-32 h-48" />
                    <span className="ml-4 text-xl">ĐẮC NHÂN TÂM</span>
                  </Link>
                </div>
              </div>
            </div>
            {/* Comment Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Bình Luận</h2>
              <div className="space-y-4 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-4">
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-bold">{comment.username}</p>
                      {editingComment === comment.id ? (
                        <div>
                          <textarea
                            className={`w-full rounded-lg p-2 ${
                              isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                            }`}
                            rows="2"
                            value={editedCommentText}
                            onChange={(e) => setEditedCommentText(e.target.value)}
                          ></textarea>
                          <button
                            className="bg-green-500 text-white px-4 py-1 rounded-lg mt-2 mr-2 hover:bg-green-600"
                            onClick={() => handleSaveEditedComment(comment.id)}
                          >
                            Lưu
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-1 rounded-lg mt-2 hover:bg-red-600"
                            onClick={() => setEditingComment(null)}
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <p>{comment.text}</p>
                      )}
                    </div>
                    {loggedInUser?.username === comment.username && (
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleEditComment(comment)}
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <textarea
                  className={`w-full rounded-lg p-4 border ${
                    isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
                  }`}
                  rows="4"
                  placeholder="Viết bình luận của bạn..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-2 hover:bg-blue-600"
                  onClick={handleCommentSubmit}
                  disabled={!loggedInUser} // Disable if user is not logged in
                >
                  Gửi
                </button>
                {!loggedInUser && (
                  <p className="text-red-500 mt-2">Bạn cần đăng nhập để bình luận.</p>
                )}
              </div>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
