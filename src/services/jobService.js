import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

const handleResponse = (response) => response.data;

const handleError = (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  throw error;
};

const createJob = async (jobData) => {
  try {
    const response = await axios.post(API_URL, jobData, getAuthHeaders());
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const getRecruiterJobs = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/recruiter/my-jobs`, {
      ...getAuthHeaders(),
      params
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const getAllJobs = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, {
      ...getAuthHeaders(),
      params
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const getJobById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const updateJob = async (id, jobData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, jobData, getAuthHeaders());
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const updateJobStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthHeaders());
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const deleteJob = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export default {
  createJob,
  getRecruiterJobs,
  getAllJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob
};
