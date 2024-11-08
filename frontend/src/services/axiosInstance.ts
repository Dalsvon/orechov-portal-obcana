import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// Add interceptors to log session cookie
axiosInstance.interceptors.request.use(request => {
  console.log('Request cookies:', document.cookie);
  return request;
});

axiosInstance.interceptors.response.use(
  response => {
    console.log('Response cookies:', document.cookie);
    return response;
  }
);

export default axiosInstance;