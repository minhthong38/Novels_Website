import React from 'react';

export default function Chapter() {
  return (
    <div className="flex">
      {/* Main Content */}
      <main className="w-full p-8">
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

          <div className="mb-6">
            <label className="block font-bold mb-2">Phần chữ</label>
            <textarea
              rows="10"
              className="border border-gray-300 w-full rounded px-4 py-2"
              defaultValue={`Kính Vạn Hoa 01: Nhà Ảo Thuật - Chương 1

Tháng tư bao giờ cũng bắt đầu bằng những ngày oi bức khó chịu. Hằng năm, vào mùa này mọi cư dân trong thành phố thường trằn trọc không ngủ. Dù nhà mở toang cửa sổ, suốt đêm cũng chỉ đón được dăm ba làn gió nhẹ thoảng qua và cứ đến gần sáng là mọi người thiếp đi trong giấc ngủ mê mệt.
Quý ròm dĩ nhiên không thể là một ngoại lệ, nhất là tối hôm qua nó thức khuya lơ khuya lắc ráng đọc cho xong cuốn "Toán học ứng dụng trong đời sống" mà nó vừa mua được chiều hôm trước.`}
            />
          </div>

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

          <button className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600">
            Lưu Thay Đổi
          </button>
        </form>
      </main>
    </div>
  );
}
