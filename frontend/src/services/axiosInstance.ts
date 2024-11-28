import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  //baseURL: 'http://192.168.1.179:3001',
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

axiosInstance.interceptors.request.use(request => {
  return request;
});

axiosInstance.interceptors.response.use(
  response => {
    return response;
  }
);

export default axiosInstance;