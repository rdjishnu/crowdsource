import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchIssues = async (params = {}) => {
  try {
    const response = await apiClient.get('/issues', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
};

export const fetchIssueById = async (id) => {
  try {
    const response = await apiClient.get(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching issue ${id}:`, error);
    throw error;
  }
};

export const updateIssueStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/issues/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for issue ${id}:`, error);
    throw error;
  }
};

export const fetchStats = async () => {
  try {
    const response = await apiClient.get('/issues/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const getImageUrl = (photoPath) => {
  if (!photoPath) return 'https://via.placeholder.com/400x300?text=No+Photo';
  if (photoPath.startsWith('http')) return photoPath;
  return `http://localhost:8080${photoPath}`;
};

export default apiClient;
