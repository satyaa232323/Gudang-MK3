import axios from 'axios';
import { logout, getToken } from './auth';

/**
 * Verify if the current token is valid by making a test request to the API
 * This can be used on app initialization to ensure the token is still valid
 * @returns {Promise<boolean>} True if valid, False otherwise
 */
export const verifyToken = async () => {
    const token = getToken();

    if (!token) {
        console.log('No token found to verify');
        return false;
    }

    try {
        // Make a request to your API's user verification endpoint
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        return response.status === 200;
    } catch (error) {
        console.error('Token verification failed:', error);

        // If token is invalid, clear it
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn('Invalid token detected, logging out');
            logout();
        }

        return false;
    }
};

/**
 * Initialize the application authentication by checking token validity
 */
export const initializeAuth = async () => {
    try {
        if (getToken()) {
            const isValid = await verifyToken();

            if (!isValid) {
                console.warn('Invalid session detected, clearing authentication');
                logout();
                window.location.href = '/login';
            }
        }
    } catch (error) {
        console.error('Auth initialization error:', error);
    }
};
