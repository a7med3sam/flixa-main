export interface DriverDetailsType {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  idImageUrl: string;
  idNumber: string;
  address: string;
  profileImage: string;
  status: string;
  creationTime: string;
  vehicles: Vehicle[];
  region?: string;
  city?: string;
  workArea?: string;
  birthDate?: Date;
  vehicleType: string;
  color: string;
  model: string;
  licenseNumber: string;
  licenseImageUrl: string;
  ProfileImage: string;
}
interface Vehicle {
  id: string;
  color: string;
  model: string;
  licenseNumber: string;
  licenseImageUrl: string;
  vehicleType: string;
}


export interface Drivers {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  registrationDate: string;
  status: string;
  profilePicture: string;
  idNumber: string;
  vehicles: Vehicle[];
  data: {
    name: string;
  }
}
export interface ApiRes<T> {
  success: boolean;
  data: T;
  message: string;
  status: number;
}

export interface DriverStatus{
  totalDrivers: number;
  activeDrivers: number;
  blockedDrivers: number;
  waitingForApprovalDrivers: number;
  delivered: number;
}
