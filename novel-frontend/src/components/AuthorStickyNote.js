import React from 'react';

function AuthorStickyNote() {
  const note = `
  HƯỚNG DẪN SỬ DỤNG AUTHOR
  1. Hover vào logo account ngay góc phải header chọn Author Profile để xem tài khoản tác giả.
  2. Ấn vào danh sách truyện bên Sidebar bên trái của Author để chọn lựa xem danh sách và thêm truyện.
  3. Nếu ấn vào xem danh sách truyện, ở đây sẽ hiện các chuyện đã tạo của tác giả, ấn vào cập nhật để xem các chương của truyện và cập nhật thông tin truyện.
  4. Nếu ấn vào thêm truyện, sẽ dược đưa đến trang thêm truyện tại đây có thể mô tả trước truyệntruyện.
  `;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-300 p-4 rounded-lg shadow-lg w-64 max-h-64 overflow-y-auto">
      <pre className="whitespace-pre-wrap">{note}</pre>
    </div>
  );
}

export default AuthorStickyNote;
