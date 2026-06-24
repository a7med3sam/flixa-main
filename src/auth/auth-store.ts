import { create } from 'zustand';
import { AuthStore, LoginCredentials, User } from './types';
import axiosInstance from 'src/utils/axios';
import { endpoints } from 'src/utils/endpoints';
import { getCookie, setCookie, removeCookie } from 'src/utils/cookie';

export const useAuthStore = create<AuthStore>()((set, get) => ({
  loading: true, // Start with loading true until init finishes
  authenticated: false,
  user: null,

  init: async () => {
    try {
      const token = getCookie('accessToken');
      const userStr = localStorage.getItem('user'); // User details can stay in localStorage or sessionStorage
      
      if (token && userStr) {
        set({ authenticated: true, user: JSON.parse(userStr), loading: false });
      } else {
        set({ authenticated: false, user: null, loading: false });
      }
    } catch (error) {
      console.error('Auth init error', error);
      set({ authenticated: false, user: null, loading: false });
    }
  },

  login: async (creds: LoginCredentials) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post(endpoints.auth.login, creds);
      const { accessToken, refreshToken, ...userData } = response.data;

      setCookie('accessToken', accessToken, 7); // Valid for 7 days
      setCookie('refreshToken', refreshToken, 30); // Valid for 30 days
      localStorage.setItem('user', JSON.stringify(userData));

      set({ authenticated: true, user: userData as User, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post(endpoints.auth.logout);
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      removeCookie('accessToken');
      removeCookie('refreshToken');
      localStorage.removeItem('user');
      
      const { user } = get();
      if (user?.avatar?.startsWith('blob:')) {
        URL.revokeObjectURL(user.avatar);
      }
      set({ authenticated: false, user: null, loading: false });
    }
  },

  verifyOtp: async (otp: string) => {
    // To be implemented
  },

  updateProfile: (updates: any) => {
    set((state) => {
      if (!state.user) return state;
      const currentUser = state.user;
      const currentAvatar = currentUser.avatar;
      const newAvatar = updates.image || currentAvatar;

      if (currentAvatar?.startsWith('blob:') && currentAvatar !== newAvatar) {
        URL.revokeObjectURL(currentAvatar);
      }

      const updatedUser = {
        ...currentUser,
        ...updates,
        avatar: newAvatar,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        user: updatedUser,
      };
    });
  },
}));
