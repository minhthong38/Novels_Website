import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../../context/UserContext'; // Import UserContext

export default function Discussion() {
  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([...comments]);
  const [newComment, setNewComment] = useState('');
  const [newCommentsCount, setNewCommentsCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const commentsEndRef = useRef(null);
  const containerRef = useRef(null);
  const { isDarkMode } = useContext(UserContext); // Get dark mode state from context

  const handleSend = () => {
    if (newComment.trim()) {
      const userComment = { user: 'User', message: newComment, color: 'black', avatar: 'https://lh7-rt.googleusercontent.com/docsz/AD_4nXfMk9krvF3lSmqd78EvF2m8RSEOk8aFoUJ_Lb5oSQo1cO3i5jj7fWDPcVEO3Tx79Ubfje2ivLX_hhzxYI2zEvhXXDpCOoAK35p1r4fzeEwS5EuaQWwMpPQNTncJprLsgdfe6E2tUderusU0N12m6xz3OGj7?key=v8ba6Z10Wr-7QNx-8gMTgw' };
      setAllComments((prevAllComments) => [...prevAllComments, userComment]);
      setNewComment('');
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        containerRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
      }
    }
  };

  const generateRandomComment = () => {
    const randomUsers = ['Thảo', 'Tuấn', 'Huyền', 'Sơn', 'Tùng', 'Linh', 'Hải', 'Phương'];
    const randomMessages = [
      'Truyện E có phần mới chưa?',
      'Kết truyện F sao ấy!',
      'Truyện G nghe đồn có phần 2?',
      'Thích truyện H quá!',
      'Truyện I cần thêm diễn biến.',
      'Truyện J thật sự rất hấp dẫn!',
      'Không thể chờ để đọc tiếp truyện K!',
      'Truyện L có nội dung rất sâu sắc.',
    ];
    const randomColors = ['pink-500', 'orange-500', 'teal-500', 'lime-500', 'brown-500', 'red-500', 'blue-500', 'purple-500'];
    const randomAvatars = [
      'https://blog.maika.ai/wp-content/uploads/2024/02/anh-meo-meme-8.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSgjs2sCO0xh0Ve1Sf8mDtBt2UhO9GRZImDw&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdHtPqWpMvl_UAqFCb_bWTPWQuQW7hAvD2Hw&s',
      'https://www.thepoetmagazine.org/wp-content/uploads/2024/06/avatar-meme-meo.jpg',
      'https://megaweb.vn/blog/uploads/images/meme-meo-cute-1.jpg',
      'https://cdn.eva.vn/upload/3-2023/images/2023-09-02/luu-ngay-ve-may-20-khoanh-khac-hai-huoc-cua-boss-de-meo-thay-loi-ban-muon-noi-13-1693636886-582-width719height900.jpg',
      'https://dulichnghialo.vn/wp-content/uploads/2024/10/anh-meo-bua-87uHbuJ3.jpg',
      'https://anhcute.net/wp-content/uploads/2024/10/Hinh-anh-meme-cho-cuoi-dang-yeu.jpg',
    ];

    const randomIndex = Math.floor(Math.random() * randomUsers.length);
    const newRandomComment = {
      user: randomUsers[randomIndex],
      message: randomMessages[randomIndex],
      color: randomColors[randomIndex],
      avatar: randomAvatars[randomIndex],
    };

    setAllComments((prevAllComments) => [...prevAllComments, newRandomComment]);
    setNewCommentsCount((prevCount) => prevCount + 1);
    setShowNotification(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      generateRandomComment();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          setShowNotification(false);
          setNewCommentsCount(0);
        }
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      containerRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
    }
  }, [allComments]);

  return (
    <div className="flex-1 mt-8 md:mt-0 mx-auto ">
      <h2 className={`text-xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>THẢO LUẬN</h2>
      <div className={`p-4 rounded-lg w-full sm:w-[90%] md:w-[70%] lg:w-[60%] mx-auto relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        <div className="h-96 overflow-auto" ref={containerRef}>
          {allComments.map((comment, index) => (
            <div key={index} className="flex items-center mb-4">
              <img src={comment.avatar} alt="User avatar" className="w-10 h-10 rounded-full mr-2"/>
              <p className="text-sm">
                <span className={`font-bold text-${comment.color}`}>{comment.user}:</span> {comment.message}
              </p>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>
        <div className="flex items-center mt-4 relative">
          <img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXfMk9krvF3lSmqd78EvF2m8RSEOk8aFoUJ_Lb5oSQo1cO3i5jj7fWDPcVEO3Tx79Ubfje2ivLX_hhzxYI2zEvhXXDpCOoAK35p1r4fzeEwS5EuaQWwMpPQNTncJprLsgdfe6E2tUderusU0N12m6xz3OGj7?key=v8ba6Z10Wr-7QNx-8gMTgw" alt="User avatar" className="w-10 h-10 rounded-full mr-2"/>
          <span className="font-bold mr-2">User:</span>
          <input 
            type="text" 
            className="flex-1 p-2 border border-gray-300 rounded-lg" 
            placeholder="Nhập tin nhắn..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="ml-2 p-2 bg-blue-500 text-white rounded-lg" onClick={handleSend}>Gửi</button>
        </div>
        {showNotification && newCommentsCount > 0 && (
          <div className="absolute bottom-16 left-0 p-2 bg-yellow-200 rounded-t-lg w-full text-center">
            <p className="text-sm">Có {newCommentsCount} tin nhắn mới!</p>
          </div>
        )}
      </div>
    </div>
  );
}
