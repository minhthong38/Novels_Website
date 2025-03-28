const API_URL = "http://localhost:5000/api/novels"; // Đổi thành URL của backend

const getNovels = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Lỗi khi lấy dữ liệu từ API");
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi API:", error);
    return [];
  }
};

export default { getNovels };
