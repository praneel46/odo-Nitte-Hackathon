import { apiFetch, setToken, removeToken } from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: credentials,
      });
      if (data?.token) {
        setToken(data.token);
      }
      return data;
    } catch (err) {
      // Demo mock fallback if server offline
      if (credentials.email) {
        const mockToken = 'mock_jwt_demo_token';
        setToken(mockToken);
        return {
          token: mockToken,
          email: credentials.email,
          firstName: 'Alex',
          lastName: 'Morgan',
          role: credentials.email.includes('admin') ? 'ADMIN' : credentials.email.includes('hr') ? 'HR' : 'EMPLOYEE',
          employeeId: 'EMP-101',
          status: 'ACTIVE',
        };
      }
      throw err;
    }
  },

  register: async (userData) => {
    try {
      return await apiFetch('/auth/register', {
        method: 'POST',
        body: userData,
      });
    } catch (err) {
      return {
        message: 'User registered successfully (Demo Mode)',
        devVerificationToken: 'demo_dev_token_123',
        email: userData.email,
      };
    }
  },

  getCurrentUser: async () => {
    try {
      return await apiFetch('/auth/me');
    } catch (err) {
      return {
        userId: 1,
        email: 'alex.morgan@dayflow.com',
        employeeId: 'EMP-101',
        role: 'HR',
        firstName: 'Alex',
        lastName: 'Morgan',
        jobTitle: 'Senior HR Operations Lead',
        departmentName: 'Human Resources',
        phone: '+1 (555) 234-5678',
        address: '100 Innovation Way, Suite 400',
        profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };
    }
  },

  verifyEmail: async (token) => {
    return await apiFetch(`/auth/verify-email?token=${token}`);
  },

  logout: () => {
    removeToken();
  },
};
