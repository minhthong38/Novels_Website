import axios from 'axios';

const API_URL = "http://localhost:5000/api";
const USERS_API = `${API_URL}/users`;
const READER_EXP = `${API_URL}/readerExps`;
const AUTHOR_EXP = `${API_URL}/authorExps`;
const READER_RANKING = `${API_URL}/readerRankings`;
const AUTHOR_RANKINGS = `${API_URL}/authorRankings`;
const NOVEL_RANKINGS_URL = `${API_URL}/novelRankings`;
const NOVEL_API = `${API_URL}/novels`;
const CATEGORY_API = `${API_URL}/categories`;
const CHAPTER_API = `${API_URL}/chapters`;
const READING_HISTORIES_API = `${API_URL}/readingHistories`;
const COMMENT_API = `${API_URL}/comments`;
const BOOKMARK_API = `${API_URL}/bookmarks`;
const RATING_API = `${API_URL}/ratings`;
const AUTHOR_REGISTER_API = `${API_URL}/authorRegisters`; // Đăng Ký làm tác giả

const TRANSACTION_API = `${API_URL}/transactions`;
const WALLET_API = `${API_URL}/wallets`;

const AUTHOR_TASK_API = `${API_URL}/authorTasks`; 


// ===================== USER =====================
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${USERS_API}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Login failed';
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${USERS_API}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Registration failed';
  }
};

export const fetchUserDetails = async (token) => {
  try {
    const response = await axios.get(`${USERS_API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to fetch user details';
  }
};

export const updateUserProfile = async (userId, updateData) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.put(`${USERS_API}/${userId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to update profile';
  }
};

// ===================== READER EXP =====================
export const addExpToReader = async (userId) => {
  try {
    if (!userId) return;
    const response = await axios.post(`${READER_EXP}/add-exp`, { userId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchReaderExp = async (readerExpId) => {
  try {
    if (!readerExpId) return;
    const response = await axios.get(`${READER_EXP}/${readerExpId}/user/iduser`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ===================== AUTHOR EXP =====================
export const fetchAuthorExp = async (userId) => {
  try {
    if (!userId) return;
    const response = await axios.get(`${AUTHOR_EXP}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addExpToAuthor = async (userId) => {
  try {
    const response = await axios.post(`${AUTHOR_EXP}/add-exp`, { userId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ===================== RANKING =====================
export const fetchReaderRankings = async () => {
  try {
    const response = await axios.get(READER_RANKING);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Unknown error occurred';
  }
};

export const fetchAuthorRankings = async () => {
  try {
    const response = await axios.get(AUTHOR_RANKINGS);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Unknown error occurred';
  }
};

export const fetchNovelRankings = async () => {
  try {
    const response = await axios.get(NOVEL_RANKINGS_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Unknown error occurred';
  }
};

// ===================== NOVEL =====================
export const fetchNovels = async () => {
  try {
    const response = await axios.get(NOVEL_API);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi không xác định';
  }
};

export const fetchNovelsByAuthor = async (idUser) => {
  try {
    const response = await axios.get(`${NOVEL_API}/user/${idUser}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi không xác định';
  }
};

export const fetchNovelsByCategory = async (categoryID) => {
  try {
    const response = await axios.get(`${NOVEL_API}/category/${categoryID}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Unknown error occurred';
  }
};

export const fetchNovelContent = async (novelID) => {
  try {
    const response = await axios.get(`${NOVEL_API}/${novelID}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi không xác định';
  }
};

export const createNovel = async (novelData) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    // Ensure status is set to ongoing if not provided
    const dataToSend = {
      ...novelData,
      status: novelData.status || 'ongoing'
    };
    const response = await axios.post(NOVEL_API, dataToSend, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Dispatch event after successful creation
    window.dispatchEvent(new Event('novel-created'));
    
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to create novel';
  }
};

export const updateNovel = async (novelId, data) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.put(`${NOVEL_API}/${novelId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to update novel';
  }
};

export const deleteNovel = async (novelId) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.delete(`${NOVEL_API}/${novelId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi khi xóa truyện';
  }
};

// ===================== CATEGORY =====================
export const fetchCategories = async () => {
  try {
    const response = await axios.get(CATEGORY_API);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi không xác định';
  }
};

export const fetchCategoryDetails = async (categoryID) => {
  try {
    const response = await axios.get(`${CATEGORY_API}/${categoryID}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Unknown error occurred';
  }
};

// ===================== CHAPTER =====================
export const fetchChaptersByNovelId = async (novelId) => {
  try {
    const response = await axios.get(`${CHAPTER_API}/novel/${novelId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi không xác định';
  }
};

export const fetchChapterContent = async (chapterId) => {
  try {
    const response = await axios.get(`${CHAPTER_API}/${chapterId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi không xác định';
  }
};

export const createChapter = async (chapterData) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.post(CHAPTER_API, chapterData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi khi tạo chương mới';
  }
};

export const updateChapter = async (chapterId, chapterData) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.put(`${CHAPTER_API}/${chapterId}`, chapterData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi khi cập nhật chương';
  }
};

// ===================== FAVORITES =====================
export const fetchFavoriteNovels = async (idUser) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log("Gọi API danh sách yêu thích với idUser:", idUser); // Kiểm tra đầu vào
    const response = await axios.get(`${API_URL}/favoriteNovels/user/${idUser}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Phản hồi API danh sách yêu thích:", response.data); // Kiểm tra phản hồi từ server
    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi gọi API danh sách yêu thích:", error);
    return [];
  }
};

export const toggleFavorite = async (idUser, idNovel) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log("Gọi API cập nhật yêu thích với ID:", idUser, idNovel); // Kiểm tra
    const response = await axios.post(`${API_URL}/favoriteNovels`, { idUser, idNovel }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Phản hồi API toggleFavorite:", response.data); // Kiểm tra phản hồi
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật yêu thích:", error);
    throw error.response?.data || { message: "Không thể cập nhật yêu thích" };
  }
};

// ===================== READING HISTORY =====================
export const fetchReadingHistories = async (userId) => {
  try {
    const response = await axios.get(`${READING_HISTORIES_API}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Unknown error occurred';
  }
};

export const createReadingHistory = async (historyData) => {
  try {
    const response = await axios.post(READING_HISTORIES_API, historyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to create reading history';
  }
};

export const deleteAllReadingHistory = async (userId) => {
  try {
    const response = await axios.delete(`${READING_HISTORIES_API}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to delete all reading history';
  }
};

// ===================== COMMENT =====================

// Thêm bình luận
export const addComment = async (idNovel, idUser, content) => {
  try {
    const response = await axios.post(COMMENT_API, {
      idNovel,
      idUser,
      content,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error.response?.data || error.message);
    throw error;
  }
};


// Lấy tất cả bình luận của một novel
export const fetchCommentsByNovel = async (novelId) => {
  try {
    const response = await axios.get(`${COMMENT_API}/novel/${novelId}`);
    console.log('API response:', response);  // Xem chi tiết phản hồi
    return response.data || []; // Kiểm tra lại cấu trúc và trả về dữ liệu
  } catch (error) {
    console.error('Error fetching comments by novel:', error);
    throw error.response?.data || 'Unknown error occurred';
  }
};

//Xóa bình luận
export const deleteComment = async (commentId) => {
try {
  const response = await axios.delete(`${COMMENT_API}/${commentId}`);
  return response.data;
} catch (error) {
  console.error('Error deleting comment:', error);
  throw error.response?.data || 'Unknown error occurred';
}
};

// Cập nhật bình luận
export const updateComment = async (commentId, content) => {
try {
  const response = await axios.put(`${COMMENT_API}/${commentId}`, {
    content,
  });
  return response.data;
} catch (error) {
  console.error('Error updating comment:', error);
  throw error.response?.data || 'Unknown error occurred';
}
};

// ===================== BOOKMARK =====================
// Thêm bookmark
export const createBookmark = async (bookmarkData) => {
  try {
    const response = await axios.post(BOOKMARK_API, bookmarkData);
    return response.data;
  } catch (error) {
    console.error('Error creating bookmark:', error.response?.data || error.message);
    throw error; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi API
  }
};

export const deleteBookmarkByChapter = async (idChapter) => {
  try {
    const response = await axios.delete(`${BOOKMARK_API}/chapter/${idChapter}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting bookmark by chapter:', error.response?.data || error.message);
    throw error; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi API
  }
};

export const getBookmarkByChapter = async (idChapter) => {
  try {
    const response = await axios.get(`${BOOKMARK_API}/chapter/${idChapter}`);
    if (response.data.message === 'Chưa có bookmark cho chương này') {
      // Nếu không có bookmark, bạn có thể xử lý theo cách khác
      console.log('Chưa có bookmark cho chương này');
      return null;
    }
    return response.data; // Trả về bookmark nếu có
  } catch (error) {
    console.error('Error fetching bookmark by chapter:', error.response?.data || error.message);
    throw error.response?.data || 'Failed to fetch bookmark by chapter';
  }
};


// ===================== RATING =====================

// Gửi đánh giá (POST request)
export const submitRating = async (novelId, userId, rating) => {
  try {
    const response = await axios.post(`${RATING_API}`, {
      userId,
      novelId,
      rating,
    });
    console.log('Rating submitted successfully');
    return response.data;
  } catch (error) {
    console.error('Error submitting rating', error);
    throw error;
  }
};

//Lấy rating tổng
export const fetchRatingsByNovel = async (novelId) => {
  try {
    const response = await axios.get(`${RATING_API}/novel/${novelId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ratings by novel:', error);
    throw error.response?.data || 'Unknown error occurred';
  }
};

// Xóa đánh giá
export const deleteRating = async (novelId, userId) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Gọi API xóa đánh giá với novelId:', novelId, 'userId:', userId);

    // Gửi yêu cầu DELETE tới API
    const response = await axios.delete(`${RATING_API}/novel/${novelId}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Rating deleted successfully', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error);
    throw error.response?.data || 'Không thể xóa đánh giá';
  }
};

//Lấy rating của của User dựa vào novelId và userId
export const fetchUserRatingForNovel = async (novelId, userId) => {
  try {
    const response = await axios.get(`${RATING_API}/novel/${novelId}/user/${userId}`);
    return response.data; // response là object chứa thông tin rating
  } catch (error) {
    console.error('Lỗi khi lấy đánh giá của user:', error);
    throw error.response?.data || 'Không thể lấy đánh giá';
  }
};

// ===================== AUTHOR REGISTER =====================
// Đăng ký làm tác giả (dành cho reader)
export const registerAsAuthor = async (data) => {
  try {
    const response = await axios.post(`${AUTHOR_REGISTER_API}/register`, {
      userId: data.idUser   // <-- map lại đúng tên key server yêu cầu
    });
    return response.data;
  } catch (error) {
    console.error('Error during author registration:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

//Kiểm tra trạng thái yêu cầu đăng ký tác giả
export const checkAuthorRequestStatus = async (userId) => {
  try {
    const response = await axios.get(`${AUTHOR_REGISTER_API}/check/${userId}`);
    return response.data;  // trả về status: pending, approved, rejected
  } catch (error) {
    throw error.response?.data || error;
  }
};
// ===================== TASK =====================
/**
 * Lấy tất cả Task mẫu
 */
export const fetchAllTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Failed to fetch all tasks';
  }
};


// ===================== MOMO QR =====================
//Thanh toán quét QR Momo
export const createMomoPayment = async (paymentData, token) => {
  try {
    const response = await axios.post(`${API_URL}/payments/create-payment`, paymentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("response",response.data);
    
    return response.data; // Trả về link QR hoặc thông tin giao dịch
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    throw error;
  }
};

// ===================== Transaction =====================
// Tạo giao dịch và số coin nhận được
export const createTransaction = async (paymentData, token) => {
  try {
    const response = await axios.post(`${TRANSACTION_API}/create-transaction`, paymentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // BẮT BUỘC CÓ
      },
    });
    console.log('Transaction created:', response.data);
    return response.data;  // Trả về thông tin giao dịch và số coin nhận được
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error.response?.data || 'Failed to create transaction';
  }
};

// Lấy lịch sử giao dịch của người dùng
export const fetchUserTransactions = async (idUser) => {
  try {
    const response = await axios.get(`${TRANSACTION_API}/transactions/${idUser}`);
    return response.data;  // Trả về danh sách giao dịch của người dùng
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error.response?.data || 'Failed to fetch user transactions';
  }
};

// ===================== Wallet USer =====================
// API Client: Tạo ví cho người dùng mới
export const createWallet = async (userId, token) => {
  try {
    const response = await axios.post(`${WALLET_API}/create/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // BẮT BUỘC CÓ
      },
    });
    console.log('Wallet created:', response.data);
    return response.data; // Trả về thông tin ví mới tạo
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error.response?.data || 'Failed to create wallet';
  }
};

// API Client: Lấy thông tin ví của người dùng
export const getWallet = async (userId, token) => {
  try {
    const response = await axios.get(`${WALLET_API}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Wallet details:', response.data);
    return response.data; // Trả về thông tin ví của người dùng
  } catch (error) {
    console.error('Error fetching wallet:', error);
    throw error.response?.data || 'Failed to fetch wallet';
  }
};

// API Client: Cập nhật số dư ví của người dùng
export const updateWallet = async (userId, amount, token) => {
  try {
    const response = await axios.put(`${WALLET_API}/update/${userId}`, { amount }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Wallet updated:', response.data);
    return response.data; // Trả về thông tin ví sau khi cập nhật
  } catch (error) {
    console.error('Error updating wallet:', error);
    throw error.response?.data || 'Failed to update wallet';
  }
};


// ===================== AUTHOR TASK =====================
/**
 * Lấy danh sách nhiệm vụ của tác giả theo authorExpId
 * @param {string} authorExpId - ID của bảng authorExp (kinh nghiệm tác giả)
 * @returns {Promise<Array>} - Mảng nhiệm vụ
 */
export const fetchAuthorTask = async (authorExpId) => {
  try {
    const response = await axios.get(`${AUTHOR_TASK_API}/${authorExpId}`);
    console.log('[API] fetchAuthorTask response:', response.data);
    // Đảm bảo luôn trả về mảng (ngay cả khi chỉ có 1 object hoặc null)
    const data = response.data.data;
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [data];
  } catch (error) {
    console.error('[API] fetchAuthorTask error:', error);
    throw error.response?.data || "Failed to fetch author task";
  }
};


/**
 * Hoàn thành nhiệm vụ tác giả hiện tại
 * @param {string} authorTaskId - ID của AuthorTask
 * @returns {Promise<Object>} - Kết quả hoàn thành nhiệm vụ
 */
export const completeAuthorTask = async (authorTaskId) => {
  try {
    const response = await axios.put(`${AUTHOR_TASK_API}/${authorTaskId}`);
    console.log('[API] completeAuthorTask response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] completeAuthorTask error:', error);
    throw error.response?.data || "Failed to complete author task";
  }
};
