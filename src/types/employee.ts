export interface Employee {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  userGroup: string;
  profileImage: string | null;
  isActive: boolean;
  userGender: 'Male' | 'Female' | string;
  registrationDate: string;
  creationTime: string;
  hasFullAccess: boolean;
  employeePermissions: {
    key: string;
    permissionActions: { key: string }[];
  }[];
}

export interface EmployeeListResponse {
  totalCount: number;
  items: Employee[];
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  phoneNumber: string;
  userGender: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
  profileImage?: File | null;
}

export interface UpdateEmployeePayload {
  name?: string;
  email?: string;
  phoneNumber?: string;
  userGender?: string;
  isActive?: boolean;
  profileImage?: File | null;
}

export interface EmployeeQueryParams {
  search?: string;
  userGender?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  skipCount?: number;
  maxResultCount?: number;
}
