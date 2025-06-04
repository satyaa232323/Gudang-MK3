/**
 * Check if user is authenticated by verifying token presence
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Save authentication token to localStorage
 * @param {string} token - The authentication token
 */
export const login = (token) => {
  if (!token) {
    console.error('Attempted to save empty token');
    return;
  }
  console.log('Setting authentication token');
  localStorage.setItem('token', token);

  // // Also store login timestamp for potential token refresh logic
  // localStorage.setItem('login_timestamp', Date.now());
};

/**
 * Clear authentication data
 */
export const logout = () => {
  console.log('Logging out, clearing authentication data');
  localStorage.removeItem('token');
  localStorage.removeItem('login_timestamp');
};

/**
 * Get the current auth token
 * @returns {string|null} The authentication token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};