import axios from 'axios';
import { logout } from './auth';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('No authentication token found');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
    (response) => {
        // Check if the response has a data property
        if (response.data !== undefined) {
            return response.data;
        }
        return response;
    },
    (error) => {
        console.error('API error:', error.response?.data || error.message);

        // Handle 401 Unauthorized errors by logging out
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn('Authentication error detected, logging out');
            logout();
            // Redirect to login will happen on the next render due to PrivateRoute
            window.location.href = '/login'; // Force redirect to login
        }

        // Format error message
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'Something went wrong';

        return Promise.reject(new Error(errorMessage));
    }
);

// Auth API calls
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', credentials, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Raw login response:', response);
        return response.data;
    } catch (error) {
        console.error('Login API error:', error.response?.data || error);
        throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
};

export const logoutUser = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No token found for logout');
            return { success: true }; // Still return success as user is effectively logged out
        }

        await apiClient.post('/logout');
        console.log('Logged out successfully from server');
        return { success: true };
    } catch (error) {
        console.error('Logout API error:', error.response?.data || error);
        // Even if the server logout fails, we still want to clear local auth data
        return { success: true };
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/register', userData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Registration response:', response);
        return response.data;
    } catch (error) {
        console.error('Registration API error:', error.response?.data || error);

        // Handle validation errors
        if (error.response?.data?.errors) {
            const validationErrors = error.response.data.errors;
            const errorMessages = Object.keys(validationErrors)
                .map(key => validationErrors[key][0])
                .join(', ');
            throw new Error(errorMessages || 'Registration failed. Please check your information.');
        }

        throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
};

// User API calls
export const getUserProfile = () => {
    return apiClient.get('/user');
};


export const getUsers = () => {
    return apiClient.get('/users');
};

// Dashboard API calls
export const getDashboardData = () => {
    return apiClient.get('/dashboard');
};

// Product API calls
export const getProducts = () => {
    return apiClient.get('/products');
};

export const getProduct = async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    // Check if response has data property which contains the actual product data
    if (response && response.data) {
        return response.data;
    }
    return response;
};

export const createProduct = (productData) => {
    return apiClient.post('/products', productData);
};

export const updateProduct = (id, productData) => {
    return apiClient.put(`/productUpdate/${id}`, productData);
};

export const deleteProduct = (id) => {
    return apiClient.delete(`/productDelete/${id}`);
};

// Category API calls
export const getCategories = () => {
    return apiClient.get('/categories');
};

export const getCategory = (id) => {
    return apiClient.get(`/categories/${id}`);
};

export const createCategory = (categoryData) => {
    return apiClient.post('/categories', categoryData);
};

export const updateCategory = (id, categoryData) => {
    return apiClient.put(`/categoriesUpdate/${id}`, categoryData);
};

export const deleteCategory = (id) => {
    return apiClient.delete(`/categoriesDelete/${id}`);
};

// Notification API calls
export const getNotifications = () => {
    return apiClient.get('/notification');
};

export const markNotificationRead = (id) => {
    return apiClient.put(`/notification/${id}`, { read: true });
};

// Transaction API calls
export const getTransactions = () => {
    return apiClient.get('/transactions');
};

export const getTransaction = (id) => {
    return apiClient.get(`/transactions/${id}`);
};

export const createTransaction = (transactionData) => {
    return apiClient.post('/transactions', transactionData);
};

export const updateTransaction = (id, transactionData) => {
    return apiClient.put(`/transaction/${id}`, transactionData);
};

export const deleteTransaction = (id) => {
    return apiClient.delete(`/transactionDelete/${id}`);
};

export default apiClient;
