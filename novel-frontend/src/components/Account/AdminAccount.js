import React from 'react'
import AdminRoute from '../routes/AdminRoute'

export default function AdminAccount() {
  return (
    <AdminRoute>
      <main className="w-3/4 p-4">
        <h1 className="text-center text-2xl font-bold mb-4">-TABLE USER-</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">STT</th>
              <th className="border border-gray-300 p-2">Hình Ảnh</th>
              <th className="border border-gray-300 p-2">Tài Khoản</th>
              <th className="border border-gray-300 p-2">Mật Khẩu</th>
              <th className="border border-gray-300 p-2">Cấp Độ</th>
              <th className="border border-gray-300 p-2">Cập Nhật</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 1, img: "https://blog.maika.ai/wp-content/uploads/2024/02/anh-meo-meme-8.jpg", username: "meomeo01", password: "111111", level: "VIP 5" },
              { id: 2, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSgjs2sCO0xh0Ve1Sf8mDtBt2UhO9GRZImDw&s", username: "meo2bim", password: "222222", level: "VIP 3" },
              { id: 3, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdHtPqWpMvl_UAqFCb_bWTPWQuQW7hAvD2Hw&s", username: "huhuhu", password: "333333", level: "VIP 2" },
              { id: 4, img: "https://www.thepoetmagazine.org/wp-content/uploads/2024/06/avatar-meme-meo.jpg", username: "rose04", password: "444444", level: "VIP 3" },
              { id: 5, img: "https://megaweb.vn/blog/uploads/images/meme-meo-cute-1.jpg", username: "meovang", password: "555555", level: "VIP 0" },
              { id: 6, img: "https://dulichnghialo.vn/wp-content/uploads/2024/10/anh-meo-bua-87uHbuJ3.jpg", username: "cudamsamset", password: "666666", level: "VIP 4" },
            ].map(user => (
              <tr key={user.id} className="text-center">
                <td className="border border-gray-300 p-2">{user.id}</td>
                <td className="border border-gray-300 p-2">
                  <img 
                    src={user.img} 
                    alt={`User ${user.username} profile picture`} 
                    className="rounded-full mx-auto w-12 h-12 object-cover" // w-12 và h-12 tương ứng với 50px
                  />
                </td>
                <td className="border border-gray-300 p-2">{user.username}</td>
                <td className="border border-gray-300 p-2">{user.password}</td>
                <td className="border border-gray-300 p-2">{user.level}</td>
                <td className="border border-gray-300 p-2">
                  <a href="#" className="text-green-500 mr-2">Cập nhật</a>
                  <a href="#" className="text-red-500">Xóa</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </AdminRoute>
  )
}
