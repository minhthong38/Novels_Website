import React from 'react';

function UserStickyNote() {
  const note = `
  HƯỚNG DẪN SỬ DỤNG USER
  1. Có thể điền và gửi tin nhắn bên ô thảo luận.
  2. Giám khảo vui lòng scroll xuống để chọn sách Tuổi Trẻ Đáng Giá Bao Nhiêu để đọc thông tin sách, xem sách và xem thông tin tác giả.
  3. Khi xem sách giám khảo có thể đánh dấu lại vị trí đọc sách bằng cách ấn vào nút Đánh Dấu, và để xem lại vị trí đang đọc giám khảo vào lịch sử đọc trong phần Account chọn đọc tiếp.
  4. Để vào Account ấn vào logo góc bên phải header, tại Account có thể cập nhật thông tin và xem lịch sử sách đã đọc.
  `;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-300 p-4 rounded-lg shadow-lg w-64 max-h-64 overflow-y-auto">
      <pre className="whitespace-pre-wrap">{note}</pre>
    </div>
  );
}

export default UserStickyNote;
