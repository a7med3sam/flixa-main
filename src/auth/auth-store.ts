import { create } from 'zustand';
import { Profile } from 'src/types/prof';

type AuthStore = {
  loading: boolean;
  authenticated: boolean;
  user: any | null;
  logout: () => void;
  updateProfile: (updates: Partial<Profile>) => void;
};

const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@flixa.com',
  phoneNumber: '+966501234567',
  image: null,
  role: 'admin',
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  loading: false,
  authenticated: true,
  user: mockUser,

  logout: () => {
    const { user } = get();
    if (user?.image?.startsWith('blob:')) {
      URL.revokeObjectURL(user.image);
    }
    set({ authenticated: false, user: null, loading: false });
  },
  updateProfile: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const currentImage = state.user.image;
      const newImage = updates.image;
      if (currentImage?.startsWith('blob:') && currentImage !== newImage) {
        URL.revokeObjectURL(currentImage);
      }
      return {
        user: {
          ...state.user,
          ...updates,
          image: newImage || currentImage,
        },
      };
    });
  },
}));
