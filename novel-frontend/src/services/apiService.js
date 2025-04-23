import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Corrected base URL
const USERS_API = `${API_URL}/users`; // Separate constant for users endpoint
const READER_EXP = `${API_URL}/readerExps`;
const NOVEL_RANKINGS_URL = `${API_URL}/novelRankings`;
const READER_RANKING = `${API_URL}/readerRankings`;
const AUTHOR_RANKINGS = `${API_URL}/authorRankings`;
const AUTHOR_EXP = `${API_URL}/authorExps`;
const NOVEL_API = `${API_URL}/novels`;
const CATEGORY_API = `${API_URL}/categories`;
const CHAPTER_API = `${API_URL}/chapters`;
const READING_HISTORIES_API = `${API_URL}/readingHistories`; // Added constant for reading histories
const FAVORITE_API = `${API_URL}/favorites`; // Added constant for favorite novels

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${USERS_API}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Login failed';
  }
};

// Add EXP to reader
export const addExpToReader = async (userId) => {
  try {
    if (!userId) {
      console.error("Không có userId, không thể cộng EXP");
      return;
    }
    console.log("Gọi API cộng EXP với userId:", userId);
    const response = await axios.post(`${READER_EXP}/add-exp`, { userId });
    console.log("Đáp ứng từ API khi cộng EXP:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi API khi cộng EXP:", error);
    throw error;
  }
};

//Lấy ReaderExp của User theo idUser
export const fetchReaderExp = async (readerExpId) => {
  try {
    if (!readerExpId) {
      console.error("Không có readerExpId, không thể lấy EXP");
      return;
    }
    console.log("Gọi API lấy EXP của userId:", readerExpId);
    const response = await axios.get(`${READER_EXP}/${readerExpId}/user/iduser`);
    console.log("Đáp ứng từ API khi lấy EXP:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi API khi lấy EXP:", error);
    throw error;
  }
};

//Lấy AuthorExp của User theo idUser
export const fetchAuthorExp = async (userId) => {
  try {
    if (!userId) {
      console.error("Không có authorExpId, không thể lấy EXP");
      return;
    }
    console.log("Gọi API lấy EXP của userId:", userId);
    const response = await axios.get(`${AUTHOR_EXP}/user/${userId}`);
    console.log("Đáp ứng từ API khi lấy Author EXP:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi API khi lấy Author EXP:", error);
    throw error;
  }
};

// Fetch user details
export const fetchUserDetails = async (token) => {
  try {
    const response = await axios.get(`${USERS_API}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to fetch user details';
  }
};



// Fetch reader rankings
export const fetchReaderRankings = async () => {
  try {
    const response = await axios.get(READER_RANKING);
    console.log("Reader Rankings Data:", response.data); // kiểm tra dữ liệu thực tế
    return response.data.data; // 👈 Lấy đúng mảng
  } catch (error) {
    console.error('Error fetching reader rankings:', error);
    throw error.response?.data || 'Unknown error occurred';
  }
};

// Fetch author rankings
export const fetchAuthorRankings = async () => {
  try {
    const response = await axios.get(AUTHOR_RANKINGS);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching author rankings:', error);
    throw error.response?.data || 'Unknown error occurred';
  }
};

// Fetch novel rankings
export const fetchNovelRankings = async () => {
  try {
    const response = await axios.get(NOVEL_RANKINGS_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching novel rankings:', error);
    throw error.response?.data || 'Unknown error occurred';
  }
};


// Fetch all novels
export const fetchNovels = async () => {
  try {
    const response = await axios.get(NOVEL_API);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi fetch novels:', error);
    throw error.response?.data || 'Lỗi không xác định';
  }
};

//featch all novels by idUSer
export const fetchNovelsByAuthor = async (idUser) => {
  try {
    const response = await axios.get(`${NOVEL_API}/user/${idUser}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi fetch novels by author:', error);
    throw error.response?.data || 'Lỗi không xác định';
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(CATEGORY_API);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi fetch category:', error);
    throw error.response?.data || 'Lỗi không xác định';
  }
};

// Fetch chapters by novel ID
export const fetchChaptersByNovelId = async (novelId) => {
  try {
    const response = await axios.get(`${CHAPTER_API}/novel/${novelId}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi fetch danh sách chương:', error);
    throw error.response?.data || 'Lỗi không xác định';
  }
};

// Fetch content of a chapter by chapter ID
export const fetchChapterContent = async (chapterId) => {
  try {
    const response = await axios.get(`${CHAPTER_API}/${chapterId}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi fetch nội dung chương:', error);
    throw error.response?.data || 'Lỗi không xác định';
  }
};

// Fetch novel by Novel ID
export const fetchNovelContent = async (novelID) => {
  try {
    const response = await axios.get(`${NOVEL_API}/${novelID}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi fetch nội dung novel:', error);
    throw error.response?.data || 'Lỗi không xác định';
  }
};

// Fetch novels by category ID
export const fetchNovelsByCategory = async (categoryID) => {
  try {
    const response = await axios.get(`${NOVEL_API}/category/${categoryID}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching novels by category:', error);
    throw error.response?.data || 'Unknown error occurred';
  }
};

// Fetch category details by category ID
export const fetchCategoryDetails = async (categoryID) => {
  try {
    const response = await axios.get(`${CATEGORY_API}/${categoryID}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching category details:', error);
    throw error.response?.data || 'Unknown error occurred';
  }
};

// Fetch user's favorite novels
export const fetchFavoriteNovels = async (idUser) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.get(`${FAVORITE_API}/user/${idUser}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('API Response:', response.data);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

// Toggle favorite (add/remove)
export const toggleFavorite = async (idUser, idNovel) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await axios.post(
      `${FAVORITE_API}`, 
      { idUser, idNovel },
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    return response.data;
  } catch (error) {
    console.error('Toggle favorite error:', error);
    throw error.response?.data || { message: 'Failed to update favorite status' };
  }
};

// Create a new novel
export const createNovel = async (novelData) => {
  try {
    const response = await axios.post(`${NOVEL_API}`, novelData);
    return response.data;
  } catch (error) {
    console.error('Error creating novel:', error);
    throw error.response?.data || 'Failed to create novel';
  }
};

// Fetch reading histories by readingHistories ID
export const fetchReadingHistories = async (userId) => { 
  try { 
    const response = await axios.get(`${READING_HISTORIES_API}/user/${userId}`);
    return response.data;  // Đảm bảo API trả về title + imageUrl của novel + chapter
  } catch (error) { 
    console.error('Error fetching reading histories:', error); 
    throw error.response?.data || 'Unknown error occurred'; 
  } 
};

// Create reading history
export const createReadingHistory = async (historyData) => {
  try {
    const response = await axios.post(`${READING_HISTORIES_API}`, historyData);
    return response.data;
  } catch (error) {
    console.error('Error creating reading history:', error);
    throw error.response?.data || 'Failed to create reading history';
  }
};

// Delete all reading history by userId
export const deleteAllReadingHistory = async (userId) => {
  try {
    const response = await axios.delete(`${READING_HISTORIES_API}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting all reading history:', error);
    throw error.response?.data || 'Failed to delete all reading history';
  }
};

