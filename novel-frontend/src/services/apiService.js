import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
const FAVORITE_API = `${API_URL}/favorites`;

// ===================== USER =====================
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${USERS_API}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Login failed';
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
    const response = await axios.post(NOVEL_API, novelData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to create novel';
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
