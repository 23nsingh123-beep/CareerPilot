import axios from 'axios';

const API_URL = 'http://localhost:5000/api/resume';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    // Let browser set the Content-Type boundary for FormData automatically
    'Content-Type': 'multipart/form-data'
  };
};

const handleError = (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  throw error;
};

const uploadResume = async (file, onUploadProgress) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: getAuthHeaders(),
      onUploadProgress
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const getCurrentResume = async () => {
  try {
    const response = await axios.get(`${API_URL}/current`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const analyzeResume = async () => {
  try {
    const response = await axios.post(`${API_URL}/analyze`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const getResumeAnalysis = async () => {
  try {
    const response = await axios.get(`${API_URL}/analysis`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export default {
  uploadResume,
  getCurrentResume,
  analyzeResume,
  getResumeAnalysis
};
