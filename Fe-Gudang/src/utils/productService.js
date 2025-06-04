// Product service for interacting with the product endpoints
import { authAPI } from './GudangAPI';

const productService = {
    // Get all products
    getAll: async () => {
        try {
            const response = await authAPI.get('/products');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch products' };
        }
    },

    // Get single product by ID
    getById: async (id) => {
        try {
            const response = await authAPI.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: `Failed to fetch product ${id}` };
        }
    },

    // Create a new product
    create: async (productData) => {
        try {
            const response = await authAPI.post('/products', productData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create product' };
        }
    },

    // Update a product
    update: async (id, productData) => {
        try {
            const response = await authAPI.put(`/productUpdate/${id}`, productData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: `Failed to update product ${id}` };
        }
    },

    // Delete a product
    delete: async (id) => {
        try {
            const response = await authAPI.delete(`/productDelete/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: `Failed to delete product ${id}` };
        }
    },
};

export default productService;
