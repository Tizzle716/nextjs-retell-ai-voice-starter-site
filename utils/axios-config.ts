import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'User-Agent': 'CustomAgent/1.0'
  }
});

export default axiosInstance;
