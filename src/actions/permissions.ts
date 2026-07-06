'use server';

import { revalidatePath } from 'next/cache';

import { ApiResponse } from 'src/types/crud-types';
// import {
//   EmployeeAccessLevel,
//   EmployeeDetail,
//   EmployeeListQuery,
//   EmployeeListResponse,
// } from 'src/types/employee';
import { deleteData, editData, getData, postData } from 'src/utils/crud-fetch-api';
import { endpoints } from 'src/utils/endpoints';

const employeesListPath = '/dashboard/users/employees';

export type PermissionItem = {
  id: string;
  name: string;
  displayNameAr: string;
  displayNameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isEnabled: boolean;
  children?: PermissionItem[];
};

type PermissionsListResponse = {
  items: PermissionItem[];
  totalCount: number;
};


export async function getPermissionsAction(): Promise<ApiResponse<PermissionsListResponse>> {
  const params = new URLSearchParams();
  params.set('SkipCount', '0');
  params.set('MaxResultCount', '1000');

  return getData<PermissionsListResponse>(`${endpoints.permissions.root}?${params.toString()}`, {
    cache: 'no-store',
  });
}

export async function getUserPermissionsAction(userId: string): Promise<ApiResponse<PermissionsListResponse>> {
  const params = new URLSearchParams();
  params.set('SkipCount', '0');
  params.set('MaxResultCount', '1000');

  return getData<PermissionsListResponse>(
    `${endpoints.permissions.userPermissions(userId)}?${params.toString()}`,
    { cache: 'no-store' }
  );
}

export async function assignPermissionAction(
  userId: string,
  permissionIds: string[]
): Promise<ApiResponse<unknown>> {
  return postData<unknown, { userId: string; permissionIds: string[] }>(
    endpoints.permissions.assign,
    { userId, permissionIds },
    { cache: 'no-store' }
  );
}

export async function revokePermissionAction(
  userId: string,
  permissionIds: string[]
): Promise<ApiResponse<unknown>> {
  return postData<unknown, { userId: string; permissionIds: string[] }>(
    endpoints.permissions.revoke,
    { userId, permissionIds },
    { cache: 'no-store' }
  );
}



