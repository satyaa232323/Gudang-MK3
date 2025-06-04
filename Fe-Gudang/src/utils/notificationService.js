// Notification service for interacting with notification endpoints
import { authAPI } from './GudangAPI';

const notificationService = {
    // Get all notifications
    getAll: async () => {
        try {
            const response = await authAPI.get('/notification');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch notifications' };
        }
    },

    // Get single notification by ID
    getById: async (id) => {
        try {
            const response = await authAPI.get(`/notification/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: `Failed to fetch notification ${id}` };
        }
    },

    // Create a new notification
    create: async (notificationData) => {
        try {
            const response = await authAPI.post('/notification', notificationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create notification' };
        }
    },

    // Update a notification
    update: async (id, notificationData) => {
        try {
            const response = await authAPI.put(`/notification/${id}`, notificationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: `Failed to update notification ${id}` };
        }
    },

    // Delete a notification
    delete: async (id) => {
        try {
            const response = await authAPI.delete(`/notification/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: `Failed to delete notification ${id}` };
        }
    },
};

export default notificationService;
