// Base API URL
const API_URL = 'http://127.0.0.1:8000/api';

/**
 * Makes a request to the API with authentication headers
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Set default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Make the API request
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Parse the response
    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

/**
 * Login user and get access token
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>} Login response with token
 */
export const loginUser = async (credentials) => {
    return apiRequest('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
};

/**
 * Get user profile
 * @returns {Promise<Object>} User data
 */
export const getUserProfile = async () => {
    return apiRequest('/user');
};

/**
 * Get dashboard data
 * @returns {Promise<Object>} Dashboard statistics and data
 */
export const getDashboardData = async () => {
    return apiRequest('/dashboard');
};
