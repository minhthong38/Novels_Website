import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Corrected base URL
const USERS_API = `${API_URL}/users`; // Separate constant for users endpoint
const NOVEL_RANKINGS_URL = `${API_URL}/novelRankings`;
const NOVEL_API = `${API_URL}/novels`;
const CATEGORY_API = `${API_URL}/categories`;
const CHAPTER_API = `${API_URL}/chapters`;
const READING_HISTORIES_API = `${API_URL}/readingHistories`; // Added constant for reading histories

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${USERS_API}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Login failed';
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
