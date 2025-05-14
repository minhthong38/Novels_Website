import { db } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';

function NotificationComponent({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const notifRef = ref(db, `notifications/${userId}`);
    const unsubscribe = onValue(notifRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notifArray = Object.values(data);
        setNotifications(notifArray);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div>
      <h3>Thông báo:</h3>
      <ul>
        {notifications.map((n, i) => (
          <li key={i}>{n.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationComponent;
