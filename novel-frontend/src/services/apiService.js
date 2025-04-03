import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';  // Existing API URL for user management
const NOVEL_RANKINGS_URL = 'http://localhost:5000/api/novelRankings';  // API URL for novel rankings


export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const fetchUserDetails = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Fetch the novel rankings from the backend
export const fetchNovelRankings = async () => {
  try {
    const response = await axios.get(NOVEL_RANKINGS_URL); // Fetch from correct API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching novel rankings:', error);
    throw error.response?.data || 'Unknown error occurred';
  }
};
