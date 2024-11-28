import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/portal/api',
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