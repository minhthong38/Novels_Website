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
const WALLETAUTHOR_API = `${API_URL}/walletAuthors`;
const BUY_CHAPTER = `${API_URL}/purchaseChapters`;
const PURCHASE_HISTORY = `${API_URL}/purchaseHistories`;
const WITHDRAWAL_API = `${API_URL}/withdrawalTransactions`; // Rút tiền

const AUTHOR_TASK_API = `${API_URL}/authorTasks`; 
const AUTHOR_LEVEL_API = `${API_URL}/authorLevels`; // Cấp độ tác giả


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

export const checkUsernameEmail = async (username, email) => {
  try {
    const response = await axios.post(`${USERS_API}/check-username-email`, { username, email });
    const { usernameExists, emailExists } = response.data;

    if (usernameExists && emailExists) {
      return 'Username và email đều đã tồn tại';
    }
    if (usernameExists) {
      return 'Username đã tồn tại';
    }
    if (emailExists) {
      return 'Email đã tồn tại';
    }

    return 'Username và email hợp lệ';
  } catch (error) {
    throw error.response?.data || 'Kiểm tra username/email thất bại';
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
    if (!readerExpId || typeof readerExpId !== 'string') return; // Thêm kiểm tra type
    
    const response = await axios.get(`${READER_EXP}/${readerExpId}/user/iduser`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ReaderExp:", error);
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
    console.log(response.data); // Kiểm tra dữ liệu trả về
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
  if (!idUser || !idNovel) {
    throw new Error("Thiếu idUser hoặc idNovel");
  }

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
    console.log("Rating submitted successfully");
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

// ===================== TRANSACTION =====================
// Tạo giao dịch và số coin nhận được
export const createTransaction = async (paymentData, token) => {
  try {
    const response = await axios.post(`${TRANSACTION_API}/create-transaction`, paymentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Transaction created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error.response?.data || 'Failed to create transaction';
  }
};

export const deleteTransaction = async (transactionId, token) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const updateTransactionStatus = async (orderId, newStatus, token) => {
  try {
    const response = await axios.put(`${TRANSACTION_API}/update-transaction`, 
      { orderId, newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
};

// Lấy lịch sử giao dịch của người dùng
export const fetchUserTransactions = async (idUser, token) => {
  try {
    const response = await axios.get(`${TRANSACTION_API}/${idUser}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data; // Chỉ trả về giao dịch của idUser
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error.response?.data || 'Failed to fetch user transactions';
  }
};

// ===================== Wallet User =====================
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

// ===================== Wallet Author =====================
// Lấy thông tin ví của author
export const getWalletByUserId = async (userId) => {
  try {
    const response = await axios.get(`${WALLETAUTHOR_API}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin ví:', error);
    throw error.response?.data || 'Không thể lấy thông tin ví';
  }
};

// ===================== BUY CHAPTER =====================
export const buyChapter = async (data) => {
  try {
    const token = localStorage.getItem('token');  // Lấy token từ localStorage
    const response = await axios.post(`${BUY_CHAPTER}/purchase`, 
data, 
      {
        headers: {
          Authorization: `Bearer ${token}`  // Thêm token vào header
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi không xác định khi mua chapter' };
  }
};

// ===================== PURCHASE HISTORY =====================
export const createPurchaseHistory = async ({ idUser, idNovel, idChapter, price }) => {
  try {
    const response = await fetch(`${PURCHASE_HISTORY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idUser, idNovel, idChapter, price }),
    });

    if (!response.ok) throw new Error('Failed to create purchase history');

    return await response.json();
  } catch (error) {
    console.error('Error creating purchase history:', error);
    throw error;
  }
};

export const checkChapterPurchased = async (userId, chapterId) => {
  try {
    const response = await fetch(`${PURCHASE_HISTORY}/check?userId=${userId}&chapterId=${chapterId}`);

    if (!response.ok) throw new Error('Failed to check purchase status');

    const data = await response.json();
    return data.isPurchased;
  } catch (error) {
    console.error('Error checking purchase status:', error);
    throw error;
  }
};
export const fetchUserPurchases = async (userId, token) => {
  try {
    const response = await axios.get(`${PURCHASE_HISTORY}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data; // Trả về danh sách giao dịch mua của user
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    throw error.response?.data || 'Failed to fetch purchase history';
  }
};

// ===================== WITHDRWAL TRANSACTION =====================
// Rút tiền ngay (chỉ gửi amount)
export const requestImmediateWithdrawal = async (amount) => {
  if (amount < 10000) {
    throw new Error('Số tiền rút tối thiểu là 10,000 VNĐ');
  }

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      WITHDRAWAL_API, // Giữ đúng endpoint
      { amount },      // 👈 Gửi đúng body cần thiết
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error withdrawing immediately:", error);
    throw error.response?.data || "Error withdrawing";
  }
};


// Hàm lấy danh sách yêu cầu rút tiền của người dùng
export const getUserWithdrawals = async () => {
  try {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    const response = await axios.get(`${WITHDRAWAL_API}/me`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    });
    return response.data; // Trả về dữ liệu danh sách yêu cầu rút tiền
  } catch (error) {
    console.error("Error fetching user withdrawals:", error);
    throw error.response?.data || "Error fetching withdrawals";
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

//Lấy AuthorTask theo idUser
export const fetchAuthorTaskByUserId = async (userId) => {
  try {
    const response = await axios.get(`${AUTHOR_TASK_API}/user/${userId}`);
    console.log('[API] fetchAuthorTaskByUserId response:', response.data);
    
    // Kiểm tra nếu response.data.data là mảng hoặc đối tượng
    const data = response.data.data;
    if (!data) return [];  // Trả về mảng rỗng nếu không có dữ liệu

    // Nếu dữ liệu không phải là mảng, chuyển thành mảng chứa 1 đối tượng
    if (!Array.isArray(data)) {
      return [data];
    }
    return data;  // Trả về mảng nếu dữ liệu là mảng
  } catch (error) {
    console.error('[API] fetchAuthorTaskByUserId error:', error);
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

// ===================== AUTHOR LEVEL =====================\
export const fetchAuthorLevel = async (authorExpId) => {  
  try {
    const response = await axios.get(`${AUTHOR_LEVEL_API}/${authorExpId}`);
    return response.data.data;
  } catch (error) {
    console.error('[API] fetchAuthorLevel error:', error);
    throw error.response?.data || "Failed to fetch author level";
  }
}

export const fetchAuthorDetails = async (userId) => {
  try {
    const response = await axios.get(`${NOVEL_API}/user/${userId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi không xác định';
  }
};
