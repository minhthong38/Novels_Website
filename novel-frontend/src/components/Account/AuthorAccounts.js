import React, { useState, useContext, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import AuthorSidebar from '../sidebar/AuthorSidebar';
import axios from 'axios';
import ListNovels from '../ListNovels/ListNovels';
import CreateNovel from '../createNovel/CreateNovel';
import UpdateNovel from '../UpdateNovel/updateNovel';
import RevenueTracking from '../RevenueTracking/RevenueTracking';
import { fetchNovelsByAuthor, fetchAuthorExp, fetchChaptersByNovelId, fetchAuthorTask, completeAuthorTask, fetchAllTasks } from '../../services/apiService';

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
  const [authorTasks, setAuthorTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [wallet, setWallet] = useState(null);

  // Helper to refresh tasks and exp
  const refreshAuthorTaskAndExp = async (expId, userId) => {
    if (!expId) return;
    try {
      const tasks = await fetchAuthorTask(expId);
      setAuthorTasks(tasks || []);
      if (userId) {
        const expData = await fetchAuthorExp(userId);
        setTotalExp(expData.totalExp || 0);
        setCurrentLevel(expData.idLevel?.level || 1);
        setTitleLevel(expData.idLevel?.title || '');
      }
    } catch (err) {
      setAuthorTasks([]);
    }
  };

  useEffect(() => {
    // Fetch all tasks mẫu
    fetchAllTasks().then(setAllTasks).catch(() => setAllTasks([]));
    
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in.');
  
        const { data: user } = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (user) {
          // Cập nhật thông tin người dùng
          setUserData(prev => ({
            ...prev,
            displayName: user.fullName || user.username,
            username: user.username,
            email: user.email || '',
            introduction: user.introduction || '',
            avatar: user.avatar || 'https://via.placeholder.com/150'
          }));
  
          // Lấy thông tin EXP
          const expData = await fetchAuthorExp(user._id);
          setTotalExp(expData.totalExp || 0);
          setCurrentLevel(expData.idLevel?.level || 1);
          setTitleLevel(expData.idLevel?.title || '');          
  
          // Lấy danh sách author tasks
          if (expData._id) {
            try {
              console.log('Gọi fetchAuthorTask với authorExpId:', expData._id);
              await refreshAuthorTaskAndExp(expData._id, user._id);
            } catch (err) {
              console.error('fetchAuthorTask error:', err);
              setAuthorTasks([]);
            }
          } else {
            console.warn('Không có authorExpId (expData._id) để lấy nhiệm vụ tác giả!');
          }
  
          // Lấy danh sách tiểu thuyết của tác giả
          const novelsData = await fetchNovelsByAuthor(user._id);
          setNovels(novelsData || []);
          setTotalViews((novelsData || []).reduce((sum, n) => sum + (n.view || 0), 0));
  
          // Tính số chương tổng
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

  // Xử lý hoàn thành nhiệm vụ tác giả
  const handleCompleteTask = async () => {
    if (!authorTasks || !authorTasks[0]) return;
    setTaskLoading(true);
    try {
      await completeAuthorTask(authorTasks[0]._id);
      // Refresh task and exp
      const expId = authorTasks[0].idAuthorExp || authorTasks[0].idAuthorExpId;
      await refreshAuthorTaskAndExp(expId, loggedInUser?._id);
    } catch (err) {
      // Optionally show error
      alert(err?.message || 'Có lỗi khi hoàn thành nhiệm vụ!');
    } finally {
      setTaskLoading(false);
    }
  };

  // Thanh tiến trình dựa trên EXP của tác giả
  const renderProgressBar = () => {
    // Tính tổng exp nhiệm vụ đã hoàn thành theo logic bảng nhiệm vụ
    const totalTasks = allTasks ? allTasks.length : 0;
    const sortedTasks = allTasks ? [...allTasks].sort((a, b) => (a.order || 0) - (b.order || 0)) : [];
    const totalNovels = novels ? novels.length : 0;
    const currentIndex = totalTasks > 0 ? totalNovels % totalTasks : 0;
    const isFullCycle = currentIndex === 0 && totalNovels > 0;
    // Tính tổng exp cộng dồn từ tất cả nhiệm vụ đã hoàn thành (nhiều vòng)
    const fullCycles = totalTasks > 0 ? Math.floor(totalNovels / totalTasks) : 0;
    const expFromFullCycles = fullCycles * sortedTasks.reduce((sum, task) => sum + (task.expPoint || 0), 0);
    const expFromCurrentCycle = sortedTasks.slice(0, currentIndex).reduce((sum, task) => sum + (task.expPoint || 0), 0);
    const expDisplay = totalExp + expFromFullCycles + expFromCurrentCycle;
    // Để xác định exp tối đa cho cấp hiện tại, ta cần lấy từ expData.idLevel.maxExp (nếu API trả về)
    // Nếu không có, có thể hardcode hoặc mặc định một giá trị
    let maxExp = null;
    if (titleLevel && typeof titleLevel === 'object') {
      // Use maxExp of the next level if available
      if (titleLevel.nextLevel && typeof titleLevel.nextLevel === 'object' && titleLevel.nextLevel.maxExp) {
        maxExp = titleLevel.nextLevel.maxExp;
      } else if (titleLevel.maxExp) {
        maxExp = titleLevel.maxExp;
      }
    }
    if (!maxExp) maxExp = 10000; // Final fallback if no data is available

    const expToNextLevel = maxExp;
    const progress = Math.min(100, Math.round((expDisplay / expToNextLevel) * 100));

    // Cập nhật cấp độ tiếp theo nếu đủ exp
    if (expDisplay >= expToNextLevel) {
      const newLevel = titleLevel.nextLevel || { level: currentLevel + 1 };
      setCurrentLevel(newLevel.level);
      setTitleLevel(newLevel.title);
    }

    return (
      <div className={`p-4 border rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-2">Tiến trình kinh nghiệm tác giả</h3>
        <div className="relative w-full bg-gray-200 rounded-full h-6">
          <div
            className="absolute top-0 left-0 h-6 bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center font-semibold text-black">
            {expDisplay} / {expToNextLevel} EXP
          </div>
        </div>
        <div className="text-right mt-2 text-sm text-gray-600 dark:text-gray-300">
          {progress}% đến cấp tiếp theo
        </div>

        {/* Danh sách tất cả Task mẫu (đẹp) */}
        <div className="mt-8">
          <h4 className="text-base font-semibold mb-2 text-blue-700 dark:text-blue-300">Tất cả nhiệm vụ mẫu</h4>
          {allTasks && allTasks.length > 0 ? (() => {
          // Sắp xếp nhiệm vụ theo order tăng dần
          const sortedTasks = [...allTasks].sort((a, b) => (a.order || 0) - (b.order || 0));
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white">
                    <th className="px-5 py-3 text-center font-bold tracking-wide">Thứ tự</th>
                    <th className="px-5 py-3 text-left font-bold tracking-wide">Tên nhiệm vụ</th>
                    <th className="px-5 py-3 text-left font-bold tracking-wide">Mô tả</th>
                    <th className="px-5 py-3 text-center font-bold tracking-wide">EXP</th>
                    <th className="px-5 py-3 text-center font-bold tracking-wide">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.map((task, idx) => {
                    const totalNovels = novels ? novels.length : 0;
                    const totalTasks = sortedTasks.length;
                    const currentIndex = totalNovels % totalTasks;
                    const isFullCycle = currentIndex === 0 && totalNovels > 0;
                    const isCompleted = isFullCycle ? true : idx < currentIndex;
                    let status = isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành';
                    return (
                      <tr
                        key={task._id}
                        className={`transition-all duration-200 group ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} hover:bg-blue-50 dark:hover:bg-blue-900`}
                      >
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-center text-gray-700 dark:text-gray-200 font-bold">
                          {task.order}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                          {task.taskName || task.title || task.name}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                          {task.description}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-center text-blue-700 dark:text-blue-300 font-bold">
                          {task.expPoint}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-center">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow transition-all duration-300
                              ${status === 'Đã hoàn thành' ? 'bg-green-500 text-white group-hover:scale-105' : 'bg-gray-300 text-gray-700 group-hover:scale-105 dark:bg-gray-700 dark:text-gray-200'}`}
                          >
                            {status === 'Đã hoàn thành' ? (
                              <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                            )}
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })() : (
            <div className="text-xs text-gray-500 italic">Không có nhiệm vụ mẫu nào.</div>
          )}
        </div>
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
      <AuthorSidebar activeView={activeView} wallet={wallet} setActiveView={setActiveView} />
      <div className={`w-full md:w-3/4 p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        {renderMainContent()}
      </div>
    </div>
  );
}

export default AuthorAccounts;