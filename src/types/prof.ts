// Matches GET /api/v1/admin/profile and PUT /api/v1/admin/profile/update responses
export interface ProfileDto {
  profileImage: string | null;
  name: string;
  email: string;
  phoneNumber: string;
}

// Matches PUT /api/v1/admin/profile/phone/send-otp and email send-otp response
export interface SendOtpResponse {
  expiryTimeByMinute: string;
}

// Legacy – kept for backward compat (auth-store still imports from here)
export interface Profile {
  id?: string;
  name: string;
  email: string;
  image?: string;
  phoneNumber: string;
  avatar?: string;
}