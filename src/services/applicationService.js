import axios from 'axios';

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}/applications`;

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

const applyForJob = async (applicationData) => {
  try {
    const response = await axios.post(API_URL, applicationData, getAuthHeaders());
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const getMyApplications = async () => {
  try {
    const response = await axios.get(`${API_URL}/my`, getAuthHeaders());
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const getJobApplicants = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/job/${jobId}`, getAuthHeaders());
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const getRecruiterApplications = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/recruiter`, {
      params,
      ...getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const getApplicationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const updateApplicationStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthHeaders());
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export default {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  getRecruiterApplications,
  getApplicationById,
  updateApplicationStatus
};
