import React, { useState, useContext, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import axios from 'axios';
import ListNovels from '../ListNovels/ListNovels';
import CreateNovel from '../createNovel/CreateNovel';
import UpdateNovel from '../UpdateNovel/updateNovel';
import RevenueTracking from '../RevenueTracking/RevenueTracking';
import { fetchNovelsByAuthor, fetchAuthorExp, fetchChaptersByNovelId } from '../../services/apiService';

const taskLevels = [
  { level: 1, chapters: 10, views: 1000 },
  { level: 2, chapters: 30, views: 5000 },
  { level: 3, chapters: 60, views: 15000 },
  { level: 4, chapters: 100, views: 30000 },
  { level: 5, chapters: 150, views: 50000 },
];

function AuthorAccounts() {
  const { loggedInUser, isDarkMode } = useContext(UserContext);
  const [activeView, setActiveView] = useState('profile');
  const [userData, setUserData] = useState({
    displayName: '',
    username: '',
    password: '',
    email: '',
    introduction: '',
    avatar: 'https://via.placeholder.com/150'
  });
  const [novels, setNovels] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalExp, setTotalExp] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [titleLevel, setTitleLevel] = useState('');
  const [totalChapters, setTotalChapters] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in.');

        const { data: user } = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (user) {
          setUserData(prev => ({
            ...prev,
            displayName: user.fullName || user.username,
            username: user.username,
            email: user.email || '',
            introduction: user.introduction || '',
            avatar: user.avatar || 'https://via.placeholder.com/150'
          }));

          const expData = await fetchAuthorExp(user._id);
          setTotalExp(expData.totalExp || 0);
          setCurrentLevel(expData.idLevel?.level || 1);
          setTitleLevel(expData.idLevel?.title || '');

          const novelsData = await fetchNovelsByAuthor(user._id);
          setNovels(novelsData || []);
          setTotalViews((novelsData || []).reduce((sum, n) => sum + (n.view || 0), 0));

          // Calculate total chapters
          const chapterCounts = await Promise.all(
            (novelsData || []).map(async (novel) => {
              const chapters = await fetchChaptersByNovelId(novel._id);
              return chapters.length;
            })
          );
          setTotalChapters(chapterCounts.reduce((sum, count) => sum + count, 0));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUserData(prev => ({ ...prev, avatar: e.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in.');

      await axios.put('http://localhost:5000/api/users/me', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const calculateProgress = (totalChapters, totalViews) => {
    let progress = 0;
    let nextLevel = null;

    for (let i = 0; i < taskLevels.length; i++) {
      const task = taskLevels[i];
      if (totalChapters >= task.chapters && totalViews >= task.views) {
        progress = (i + 1) / taskLevels.length;
      } else {
        nextLevel = task;
        const prevTask = taskLevels[i - 1] || { chapters: 0, views: 0 };
        const chapterProgress = Math.min(
          (totalChapters - prevTask.chapters) / (task.chapters - prevTask.chapters),
          1
        );
        const viewProgress = Math.min(
          (totalViews - prevTask.views) / (task.views - prevTask.views),
          1
        );
        progress += (chapterProgress * viewProgress) / taskLevels.length;
        break;
      }
    }

    return { progress: (progress * 100).toFixed(2), nextLevel };
  };

  const renderProgressBar = () => {
    const { progress, nextLevel } = calculateProgress(totalChapters, totalViews);

    return (
      <div className={`p-4 border rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-2">Tiến độ cấp bậc</h3>
        <div className="relative w-full bg-gray-200 rounded-full h-6">
          <div
            className="absolute top-0 left-0 h-6 bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
          <div className="absolute top-4 w-full flex justify-between">
            {taskLevels.map((task) => {
              const isCompleted = totalChapters >= task.chapters && totalViews >= task.views;
              return (
                <div key={task.level} className="relative w-1/5 text-center">
                  <span
                    className={`absolute -top-5 w-8 h-8 flex items-center justify-center rounded-full text-black ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    style={{ left: '50%', transform: 'translateX(-50%)' }}
                  >
                    {task.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between mt-6 text-xs">
          {taskLevels.map((task) => {
            const isCompleted = totalChapters >= task.chapters && totalViews >= task.views;
            return (
              <div key={task.level} className="text-center w-1/5">
                <p>Chương: {task.chapters}</p>
                <p>Lượt xem: {task.views}</p>
                {isCompleted && <p className="text-green-600 font-semibold mt-1">✔ Đã hoàn thành</p>}
              </div>
            );
          })}
        </div>
        {nextLevel && (
          <div className="mt-4 text-sm">
            <p>
              Để đạt cấp độ tiếp theo, bạn cần thêm{' '}
              <span className="font-bold">{Math.max(0, nextLevel.chapters - totalChapters)}</span> chương và{' '}
              <span className="font-bold">{Math.max(0, nextLevel.views - totalViews)}</span> lượt đọc.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'listNovels':
        return <ListNovels currentLevel={currentLevel} />;
      case 'createNovel':
        return <CreateNovel currentLevel={currentLevel} />;
      case 'updateNovel':
        return <UpdateNovel currentLevel={currentLevel} />;
      case 'revenueTracking':
        return <RevenueTracking currentLevel={currentLevel} />;
      default:
        return (
          <div>
            <div className={`m-4 text-center py-3 font-semibold text-sm mb-4 ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-200 text-red-700'}`}>
              Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt Nam...
            </div>
            <div className="mb-4 text-center">
              <label htmlFor="image-upload" className="cursor-pointer">
                <img src={userData.avatar} alt="avatar" className="rounded-full mx-auto w-24 h-24 mb-2 border-4" />
              </label>
              <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} />
              <p className="text-lg font-bold">{userData.displayName}</p>
              <p className="text-sm">{`Cấp độ hiện tại: ${currentLevel} - ${titleLevel}`}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-center">
              <div className="border rounded-lg py-2 shadow">
                <p className="text-sm">Tổng truyện đã đăng</p>
                <p className="text-lg font-bold">{novels.length}</p>
              </div>
              <div className="border rounded-lg py-2 shadow">
                <p className="text-sm">Tổng chương đã đăng</p>
                <p className="text-lg font-bold">{totalChapters}</p>
              </div>
              <div className="border rounded-lg py-2 shadow">
                <p className="text-sm">Tổng lượt đọc</p>
                <p className="text-lg font-bold">{totalViews}</p>
              </div>
            </div>
            {renderProgressBar()}
            <div className="space-y-2 text-sm">
              {['displayName', 'username', 'password', 'email', 'introduction'].map((field) => (
                <div key={field}>
                  <label className="font-semibold capitalize">{field === 'displayName' ? 'Tên tác giả' : field === 'fullname' ? 'Tên đăng nhập' : field === 'password' ? 'Mật khẩu' : field === 'email' ? 'Email' : 'Giới thiệu'}:</label>
                  {field === 'introduction' ? (
                    <textarea
                      value={userData[field]}
                      onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
                      className={`w-full border rounded-lg p-2 mt-1 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                    />
                  ) : (
                    <input
                      type={field === 'password' ? 'password' : 'text'}
                      value={userData[field]}
                      onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
                      className={`w-full border rounded-lg p-2 mt-1 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600" onClick={handleSave}>
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        );
    }
  };

  if (!loggedInUser) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để truy cập tài khoản tác giả.</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <AuthorSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className={`w-full md:w-3/4 p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        {renderMainContent()}
      </div>
    </div>
  );
}

export default AuthorAccounts;