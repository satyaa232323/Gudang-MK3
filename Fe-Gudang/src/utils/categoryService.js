// Category service for interacting with the category endpoints
import { authAPI } from './GudangAPI';

const categoryService = {
    // Get all categories
    getAll: async () => {
        try {
            const response = await authAPI.get('/categories');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch categories' };
        }
    },

    // Get single category by ID
    getById: async (id) => {
        try {
            const response = await authAPI.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: `Failed to fetch category ${id}` };
        }
    },

    // Create a new category
    create: async (categoryData) => {
        try {
            const response = await authAPI.post('/categories', categoryData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create category' };
        }
    },

    // Update a category
    update: async (id, categoryData) => {
        try {
            const response = await authAPI.put(`/categoriesUpdate/${id}`, categoryData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: `Failed to update category ${id}` };
        }
    },

    // Delete a category
    delete: async (id) => {
        try {
            const response = await authAPI.delete(`/categoriesDelete/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: `Failed to delete category ${id}` };
        }
    },
};

export default categoryService;
