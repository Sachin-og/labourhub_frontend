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
// Create a new post
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/posts/create`, postData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getOpenPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/posts/open/${userId}`);
    return response.data; // Return the fetched posts
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Return error details
  }
};
export const getClosedPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/posts/closed/${userId}`);
    return response.data; // Return the fetched posts
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Return error details
  }
};
export const getAllPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/posts/all/${userId}`);
    return response.data; // Return the fetched posts
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Return error details
  }
};
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/users`); // Replace with your backend endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
const instance = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this is the correct base URL
  headers: {
    'Content-Type': 'application/json',
  },
});
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user profile: ' + error.message);
  }
};
export const getPostById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/posts/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user profile: ' + error.message);
  }
};
export const fetchNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notification/${userId}`);
    return response.data; // Return the notifications data
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error; // Re-throw the error for further handling
  }
};
export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/posts/delete/${postId}`);
    return response.data; // Return success message if any
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const editPost = async (postId, updatedPostData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/posts/edit/${postId}`, updatedPostData);
    return response.data; // Return updated post data
  } catch (error) {
    console.error('Error editing the post:', error);
    throw error.response?.data || { error: 'Failed to edit post' };
  }
};


// Function to fetch recent posts (posted within the last 5 days)
export const getRecentPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/posts/recent`); // Adjust the URL as per your API
    return response.data; // Return the posts data
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    throw new Error('Error fetching recent posts'); // Handle error appropriately
  }
};

export default instance;
