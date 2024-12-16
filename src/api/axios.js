import axios from 'axios';


const API_BASE_URL = 'http://localhost:5000'; // Update to match your backend URL

export const getProfile = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      params: { email },
    });
    return response.data; // Return profile data
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error.response.data; // Return error details
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/profile/update`, profileData);
    return response.data; // Return success message and updated profile
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response.data; // Return error details
  }
};

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this is the correct base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
