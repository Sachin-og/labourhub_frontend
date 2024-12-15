import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this is the correct base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
