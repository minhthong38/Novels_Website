import React from 'react'
import { Link } from 'react-router-dom';
import AuthorStickyNote from "../AuthorStickyNote";

export default function authors() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-center text-3xl font-bold mb-6 mt-10">ROSIE NGUYỄN</h1>
      <div className="flex flex-col items-center mb-8">
        <img src="https://dep.com.vn/wp-content/uploads/2020/10/70751430_10156871283529261_8981476571051196416_o.jpg" style={{ width: '180px', height: '180px' }} alt="Rosie Nguyễn" className="mb-4"/>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">TIỂU SỬ</h2>
          <p className="text-base">
            Rosie Nguyễn là một nữ nhà văn người Việt Nam. Cô nổi tiếng với những tác phẩm về tuổi trẻ, sự nghiệp, và phát triển bản thân. Các tác phẩm của cô đã truyền cảm hứng cho rất nhiều độc giả trẻ.
          </p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-6">CÁC TÁC PHẨM:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="text-center">
          <img src="https://i.imgur.com/ZHvmnsm.jpeg" alt="Tuổi trẻ đáng giá bao nhiêu" className="mb-4" style={{ width: '180px', height: '250px' }}/>
          <p className="text-base">TUỔI TRẺ ĐÁNG GIÁ BAO NHIÊU</p>
        </div>
        <div className="text-center">
          <img src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1520534252i/39083808.jpg" alt="Mình nói gì khi nói về hạnh phúc" className="mb-4" style={{ width: '180px', height: '250px' }}/>
          <p className="text-base">MÌNH NÓI GÌ KHI NÓI VỀ HẠNH PHÚC</p>
        </div>
        <div className="text-center">
          <img src="https://img.websosanh.vn/v10/users/review/images/894fsk3kgocyy/sach-ta-ba-lo-tren-dat-a.jpg?compress=85&width=660" alt="Ta có hẹn với thanh xuân" className="mb-4" style={{ width: '180px', height: '250px' }}/>
          <p className="text-base">TA BA LÔ TRÊN ĐẤT Á</p>
        </div>
        <div className="text-center">
          <img src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1629638680i/58828694.jpg" alt="Điều khó nhặt giữa trần ai" className="mb-4" style={{ width: '180px', height: '250px' }}/>
          <p className="text-base">TRÊN HÀNH TRÌNH TỰ HỌC</p>
        </div>
        <div className="text-center">
          <img src="https://i0.wp.com/jonathanmarkwriter.com/wp-content/uploads/2016/11/Coming-Soon-Hardcover-Book-MockUp.png?fit=900%2C1001&ssl=1" alt="Nếu chỉ còn một ngày để sống" className="mb-4" style={{ width: '180px', height: '250px' }}/>
          <p className="text-base">NẾU CHỈ CÒN MỘT NGÀY ĐỂ SỐNG</p>
        </div>
        <div className="text-center">
          <img src="https://i0.wp.com/jonathanmarkwriter.com/wp-content/uploads/2016/11/Coming-Soon-Hardcover-Book-MockUp.png?fit=900%2C1001&ssl=1" alt="Tuổi trẻ không có lỗi, chơi lớn đi" className="mb-4" style={{ width: '180px', height: '250px' }}/>
          <p className="text-base">TUỔI TRẺ KHÔNG CÓ LỖI, CHƠI LỚN ĐI</p>
        </div>
        <div className="text-center">
          <img src="https://i0.wp.com/jonathanmarkwriter.com/wp-content/uploads/2016/11/Coming-Soon-Hardcover-Book-MockUp.png?fit=900%2C1001&ssl=1" alt="Đừng bao giờ từ bỏ ước mơ" className="mb-4" style={{ width: '180px', height: '250px' }}/>
          <p className="text-base">ĐỪNG BAO GIỜ TỪ BỎ ƯỚC MƠ</p>
        </div>
        <div className="text-center">
          <img src="https://i0.wp.com/jonathanmarkwriter.com/wp-content/uploads/2016/11/Coming-Soon-Hardcover-Book-MockUp.png?fit=900%2C1001&ssl=1" alt="Chuyện mẹ kể" className="mb-4" style={{ width: '180px', height: '250px' }}/>
          <p className="text-base">CHUYỆN MẸ KỂ</p>
        </div>
      </div>
      <AuthorStickyNote />
    </div>
  )
}
