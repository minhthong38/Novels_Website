import React from 'react'
import AuthorRoute from '../routes/AuthorRoute'
// import AuthorStickyNote from "../AuthorStickyNote";

export default function Chapter() {
    
  return (
    <AuthorRoute>
      <div className="flex">
        {/* Main Content */}
        <main className="w-3/4 p-8">
          {/* Alerts */}
          <div className="bg-red-200 text-red-700 text-center py-3 font-semibold text-sm mb-4">
            Chỉ chấp nhận nội dung phù hợp với thuần phong mỹ tục và pháp luật Việt
            Nam. Tác giả lưu ý khi đăng tải tác phẩm. Nếu vi phạm bạn có thể bị
            khóa truyện, nếu tái phạm có thể bị khóa tài khoản vĩnh viễn.
          </div>
          <div className="bg-green-200 text-green-700 text-center py-3 font-semibold text-sm mb-4">
            Truyện sau khi đăng đủ 5 chương mới có thể gửi duyệt. Truyện sau khi
            gửi yêu cầu duyệt mất từ 1-2 ngày để xem xét. Khi đã duyệt hoặc từ
            chối bạn sẽ nhận được thông báo.
          </div>

          {/* Form */}
          <form enctype="multipart/form-data">
            <div className="mb-6">
              <label className="block font-bold mb-2">Tỉ lệ chia sẻ doanh thu</label>
              <input
                type="text"
                value="60% - 40%"
                disabled
                className="border border-gray-300 w-full rounded px-4 py-2 bg-gray-100"
              />
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2">Chương 1</label>
              <input
                type="text"
                value="Nhà ảo thuật"
                className="border border-gray-300 w-full rounded px-4 py-2"
              />
            </div>

            {/* Text Editor Section */}
            <div className="mb-6">
              <label className="block font-bold mb-2">Phần chữ</label>
              <textarea
                rows="10"
                className="border border-gray-300 w-full rounded px-4 py-2"
                defaultValue={`Kính Vạn Hoa 01: Nhà Ảo Thuật - Chương 1

Tháng tư bao giờ cũng bắt đầu bằng những ngày oi bức khó chịu. Hằng năm, vào mùa này mọi cư dân trong thành phố thường trằn trọc không ngủ. Dù nhà mở toang cửa sổ, suốt đêm cũng chỉ đón được dăm ba làn gió nhẹ thoảng qua và cứ đến gần sáng là mọi người thiếp đi trong giấc ngủ mê mệt.
Quý ròm dĩ nhiên không thể là một ngoại lệ, nhất là tối hôm qua nó thức khuya lơ khuya lắc ráng đọc cho xong cuốn "Toán học ứng dụng trong đời sống" mà nó vừa mua được chiều hôm trước.
Như thường lệ, đúng sáu giờ rưỡi sáng, chuông báo thức đổ hồi. Nhưng Quý ròm không buồn nhỏm dậy. Nó cựa quậy và lăn một vòng trên giường trong khi mắt vẫn nhắm tịt. Đang mơ mơ màng màng, Quý ròm cảm thấy có ai đó đang nắm lấy chân nó. Rồi tiếng bà gọi khẽ:
Nào, dậy đi cháu!
Quý ròm không trả lời, thậm chí không cả nhúc nhích. Tất nhiên nó không dại gì hé môi để bà biết là nó đã thức.`}
              />
            </div>

            {/* Upload Images Section */}
            <div className="mb-6">
              <label className="block font-bold mb-2">Phần nổi</label>
              <div className="border border-gray-300 p-4 rounded">
                <label className="block mb-2">Set thời gian chuyển slide:</label>
                <input
                  type="number"
                  step="0.1"
                  className="border border-gray-300 rounded px-4 py-2 mb-4"
                  defaultValue="0.5"
                />
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((_, idx) => (
                    <input
                      key={idx}
                      type="file"
                      className="w-20 h-20 object-cover rounded shadow-md"
                      accept="image/*"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600">
              Lưu Thay Đổi
            </button>
          </form>
        </main>
        {/* <AuthorStickyNote /> */}
      </div>
    </AuthorRoute>
  )
}
