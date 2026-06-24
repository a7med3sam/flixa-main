import { Profile } from "src/types/prof";

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  role: string;
  isVerified: boolean;
  avatar?: string; // Optional if we still need an avatar field
  modules?: any[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthStore {
  loading: boolean;
  authenticated: boolean;
  user: User | null;
  login: (creds: LoginCredentials) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void | { error: string }>;
  init: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => void;
}

export interface UserSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}
