import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotificationsByUser, deleteNotification } from '../../services/apiService';
import { UserContext } from '../../context/UserContext';
import { Bell, Trash2 } from 'lucide-react';

export default function NotificationPage() {
  const { isDarkMode, loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!loggedInUser?._id) {
        setNotifications([]); // Clear notifications if not logged in
        setLoading(false);
        return;
      }

      try {
        const response = await getNotificationsByUser(loggedInUser._id);
        if (response && Array.isArray(response)) {
          setNotifications(response); // Assume the API directly returns an array of notifications
        } else {
          setError('Không thể tải thông báo.');
          console.error('Invalid response format:', response);
        }
      } catch (err) {
        console.error('Lỗi khi tải thông báo:', err);
        setError('Không thể tải thông báo. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [loggedInUser?._id]);

  const handleRedirect = (link) => {
    if (link) navigate(link);
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert('Xóa thông báo thất bại!');
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-start p-8 sm:p-4 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className={`shadow-md rounded-xl p-6 w-full max-w-3xl space-y-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="font-bold text-2xl flex items-center gap-2 mb-4">
          <Bell className="w-6 h-6 text-blue-500" />
          Thông báo của bạn
        </h2>

        {error && (
          <div className="p-4 rounded-lg bg-red-100 text-red-700 mb-4">
            {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-10">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-notification-4790933-3989286.png" alt="No notifications" className="mx-auto mb-4 w-32 h-32" />
            <p className="text-lg font-medium">Hiện tại bạn chưa có thông báo nào.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleRedirect(notif.link)}
              className={`relative group cursor-pointer p-5 pl-6 border-l-4 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${
                isDarkMode
                  ? 'bg-gray-700 border-blue-400 hover:bg-gray-600'
                  : 'bg-gray-100 border-blue-500 hover:bg-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-lg truncate">{notif.title}</h3>
                  <p className="text-sm opacity-80 truncate">{notif.description}</p>
                  <p className="text-xs opacity-60 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notif._id);
                  }}
                  title="Xóa"
                  className="text-red-500 hover:text-red-600 self-start sm:self-center transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
