import axios from 'axios';

// Set default credentials for all axios requests
axios.defaults.withCredentials = true;

// Add response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - redirecting to signup");
      window.location.href = "http://localhost:3000/signup";
    }
    return Promise.reject(error);
  }
);

export default axios;
