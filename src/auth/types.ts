import { Profile } from "src/types/prof";

export interface User {
  id: string;
  name: string;
  avatar: string;
  username: string;
  email: string;
  email_verified_at: null;
  phone: string;
  phone_verified_at: null;
  roles: string[];
  modules: string[];
}


export interface LoginCretentials {
  email: string;
  password: string;
}

export interface AuthStore {
  loading: boolean;
  authenticated: boolean;
  user: User  | null;
  login: (creds: LoginCretentials) => Promise<void | { error: string }>;
  verifyOtp: (otp: string) => Promise<void | { error: string }>;
   init: () => Promise<void | { accessTokenExp: number } | undefined>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => void;
}

export interface UserSession {
  user: User;
  accessToken: { value: string; expire: Date };
  refreshToken: { value: string; expire: Date };
}
