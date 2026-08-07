// File: web_dashboard/src/services/issueService.js
import axiosInstance from '../api/axiosInstance';

export const issueService = {
    getAllIssues: async () => {
        const response = await axiosInstance.get('/issues');
        return response.data || [];
    },
    updateIssueStatus: async (id, status) => {
        const response = await axiosInstance.put(`/issues/${id}/status`, { status });
        return response.data;
    }
};
