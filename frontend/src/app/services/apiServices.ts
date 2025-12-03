import axios, { AxiosInstance } from 'axios';

// Helper function to get token from localStorage
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If sending FormData, remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const apiService = {
  get: async function (url: string): Promise<any> {
    console.log('get', url);
    try {
      const response = await axiosInstance.get(url);
      console.log('Response', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async function (url: string, data: any): Promise<any> {
    console.log('post', url, data);
    try {
      const response = await axiosInstance.post(url, data);
      console.log('Response', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  postWithoutToken: async function (url: string, data: any): Promise<any> {
    console.log('post without token', url, data);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log('Response', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async function (url: string, data: any): Promise<any> {
    console.log('put', url, data);
    try {
      const response = await axiosInstance.put(url, data);
      console.log('Response', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async function (url: string): Promise<any> {
    console.log('delete', url);
    try {
      const response = await axiosInstance.delete(url);
      console.log('Response', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;