import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth/`;

const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const login = async (email, password) => {
  const response = await axios.post(API_URL + 'login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const getToken = () => {
  return localStorage.getItem('token');
};

const updateProfile = async (profileData) => {
  const token = getToken();
  const response = await axios.put(`${API_URL.replace('/auth/', '/users/profile')}`, profileData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const uploadProfileImage = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await axios.post(`${API_URL.replace('/auth/', '/users/profile-image')}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  updateProfile,
  uploadProfileImage
};

export default authService;
