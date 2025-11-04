import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  baseurl } from './API';

const instance = axios.create({
  baseURL: `${baseurl}`,
});
instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug log
    console.log('📤 API Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      payload: config.data,
      token: token ? token : 'No Token Found',
    });

    return config;
  },
  error => {
    console.log('❌ Request Error:', error);
    return Promise.reject({
      status: 0,
      message: 'Request setup failed',
      data: null,
    });
  }
);

// ✅ Response interceptor
instance.interceptors.response.use(
  response => {
    // Debug log
    console.log('📥 API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
      token: response.config.headers?.Authorization || 'No Token',
    });
    return response;
  },
  error => {
    let normalizedError;

    if (error.response) {
      // Server responded with an error
      normalizedError = {
        status: error.response.status,
        message: error.response.data?.message || 'Something went wrong',
        data: error.response.data || null,
      };

      console.log('❌ API Error Response:', {
        url: error.response.config?.url,
        ...normalizedError,
      });
    } else if (error.request) {
      // No response received
      normalizedError = {
        status: 0,
        message: 'No response from server',
        data: null,
      };

      console.log('⚠️ No Response Received:', error.request);
    } else {
      // Something else went wrong
      normalizedError = {
        status: 0,
        message: error.message || 'Unexpected error',
        data: null,
      };

      console.log('🚨 Request Setup Error:', error.message);
    }

    return Promise.reject(normalizedError);
  }
);

export default instance;
