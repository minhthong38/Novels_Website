import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext'; // Import UserContext to get user info
import { categories, novels } from '../../data/data'; // Import categories and novels data

export default function MessageAI() {
  const { loggedInUser } = useContext(UserContext); // Get user info from context
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const predefinedResponses = [
    'Xin chào! Bạn cần giúp gì?',
    'Tôi có thể giúp bạn tìm kiếm thông tin.',
    'Hãy cho tôi biết bạn đang thắc mắc điều gì.',
    'Bạn có muốn biết thêm về các tính năng của chúng tôi không?',
    'Tôi có thể giúp bạn giải đáp các câu hỏi về truyện.',
    'Bạn có thể thử tìm kiếm truyện theo thể loại yêu thích.',
    'Bạn cần hỗ trợ gì thêm không?',
    'Hãy cho tôi biết nếu bạn cần gợi ý truyện.',
    'Tôi có thể giúp bạn tìm truyện theo tác giả.',
    'Bạn có muốn khám phá các truyện mới không?',
    'Tôi có thể gợi ý các truyện đang được yêu thích.',
    'Bạn có thể tìm kiếm truyện theo từ khóa.',
    'Tôi có thể giúp bạn quản lý tài khoản của mình.',
    'Bạn có muốn biết thêm về các chương trình khuyến mãi không?',
    'Tôi có thể hỗ trợ bạn trong việc nạp coin.',
    'Bạn có thể tìm kiếm lịch sử đọc của mình.',
    'Tôi luôn sẵn sàng nếu bạn cần thêm thông tin.'
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Add the initial AI message when the chat is opened
      setMessages([
        {
          text: 'Cảm ơn bạn đã nhắn tin! Tôi là AI, rất vui được hỗ trợ bạn.',
          user: {
            name: 'AI Assistant',
            avatar: 'https://i.pinimg.com/236x/a8/33/e9/a833e9e7a2ffb7809e48fbc2d5b9d606.jpg',
          },
        },
      ]);
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const userMessage = {
        text: currentMessage,
        user: {
          name: loggedInUser?.fullName || loggedInUser?.username || 'Guest',
          avatar: loggedInUser?.img || 'https://preview.redd.it/rcnsx8z4ztr91.jpg?auto=webp&s=52ea8077be8177b86bc76f0d4e44343c3d6e0d08',
        },
      };

      let aiResponseText = predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)]; // Default random response
      let aiResponseImages = []; // To store book images

      // Check for category keywords in the user's message
      const lowerCaseMessage = currentMessage.toLowerCase();
      const matchedCategory = categories.find(category =>
        lowerCaseMessage.includes(category.name.toLowerCase())
      );

      if (matchedCategory) {
        // Find novels that match the category
        const recommendedNovels = novels.filter(novel => novel.CategoryID === matchedCategory.id);
        if (recommendedNovels.length > 0) {
          aiResponseText = `Here are some books in the "${matchedCategory.name}" category you might like:`;
          aiResponseImages = recommendedNovels.slice(0, 2).map(novel => ({
            title: novel.Title,
            imageUrl: novel.ImageUrl,
          }));
        } else {
          aiResponseText = `Sorry, I couldn't find any books in the "${matchedCategory.name}" category.`;
        }
      }

      const aiResponse = {
        text: aiResponseText,
        user: {
          name: 'AI Assistant',
          avatar: 'https://i.pinimg.com/236x/a8/33/e9/a833e9e7a2ffb7809e48fbc2d5b9d606.jpg',
        },
        images: aiResponseImages, // Include images in the response
      };

      setMessages([...messages, userMessage, aiResponse]); // Add both user message and AI response
      setCurrentMessage(''); // Clear the textbox
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Image above Chat Bar */}
      {!isOpen && (
        <img
          src="https://www.decalvenue.com/cdn/shop/files/1SR5OqMGpLOi2mxuIUrZMFeGkl5RvatYNI4z6HBLLAY.png?v=1728429613"
          alt="AI Icon"
          className="w-24 h-24 rounded-full ml-2"
        />
      )}
      {/* Chat Bar */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
        >
          Chat with AI
        </button>
      )}

      {/* Chat Form */}
      {isOpen && (
        <div className="mt-2 bg-white shadow-lg rounded-lg p-4 w-80 relative">
          {/* Close Button */}
          <button
            onClick={toggleChat}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
          <div className="text-lg font-bold mb-2">AI Chat</div>
          <div className="mb-2 max-h-40 overflow-y-auto">
            {/* Display messages */}
            {messages.map((message, index) => (
              <div key={index} className="flex items-start mb-4">
                <img
                  src={message.user.avatar}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex-1">
                  <div className="font-bold text-sm">{message.user.name}</div>
                  <div className="bg-gray-100 p-2 rounded text-sm text-black">
                    {message.text}
                    {/* Display book images if available */}
                    {message.images && message.images.length > 0 && (
                      <div className="flex mt-2 space-x-2">
                        {message.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="flex flex-col items-center">
                            <img
                              src={image.imageUrl}
                              alt={image.title}
                              className="w-16 h-24 object-cover rounded"
                            />
                            <div className="text-xs text-center mt-1">{image.title}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows="2"
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          ></textarea>
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
