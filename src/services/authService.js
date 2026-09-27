import apiClient, { executeApi } from './api';

export const authService = {
  // Admin login request to FastAPI backend (/api/auth/login)
  login: async (username, password, rememberMe = false) => {
    return executeApi(
      () => apiClient.post('/auth/login', { username, password }),
      () => {
        // Mock authentication check if FastAPI is not yet running
        // Accepts admin / admin123 or admin@sivakasicrackers.com / diwali2026
        if (
          (username === 'admin' || username === 'admin@sivakasicrackers.com') &&
          (password === 'admin123' || password === 'diwali2026')
        ) {
          const fakeToken = `skf_jwt_${btoa(username + ':' + Date.now())}`;
          const adminUser = {
            id: 'adm_1',
            username: username,
            name: 'Sivakasi Admin Operations',
            role: 'superadmin',
            email: 'admin@sivakasicrackers.com'
          };
          return {
            access_token: fakeToken,
            token_type: 'bearer',
            user: adminUser,
            rememberMe
          };
        } else {
          const err = new Error('Invalid administrator credentials. Please check your username and password.');
          err.response = { data: { detail: 'Invalid administrator credentials' } };
          throw err;
        }
      }
    );
  },

  // Verify currently saved admin token
  verifyToken: async () => {
    const token = localStorage.getItem('sivakasi_admin_token');
    if (!token) return null;

    return executeApi(
      () => apiClient.get('/auth/me'),
      () => {
        const storedUser = localStorage.getItem('sivakasi_admin_user');
        return storedUser ? JSON.parse(storedUser) : null;
      }
    );
  },

  // Admin Logout
  logout: async () => {
    try {
      await apiClient.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('sivakasi_admin_token');
      localStorage.removeItem('sivakasi_admin_user');
    }
  }
};
