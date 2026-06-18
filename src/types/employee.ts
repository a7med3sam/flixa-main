export interface PermissionAction {
  id: string;
  key: string;
  nameAr: string;
  nameEn: string;
}

export interface EmployeePermission {
  id: string;
  key: string;
  nameAr: string;
  nameEn: string;
  actions: PermissionAction[];
}

export interface Employee {
  id: string;
  url: string;
  name: string;
  phoneNumber: string;
  creationTime: string;
  hasFullAccess: boolean;
  email: string;
  passwordNew: string;
  passwordOld: string;
   status: boolean | string;
  employeePermissions: {
    key: string;
    permissionActions: {
      key: string;
    }[];
  }[];
  // EmployeePermissions: EmployeePermission[]; // Changed from string[] to typed array
}
