import type {
  Employee,
  EmployeeQueryParams,
  EmployeeListResponse,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from 'src/types/employee';

import axiosInstance from 'src/utils/axios';
import { endpoints } from 'src/utils/endpoints';

function buildQueryString(params: EmployeeQueryParams): string {
  const parts: string[] = [];
  if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`);
  if (params.userGender) parts.push(`userGender=${encodeURIComponent(params.userGender)}`);
  if (params.isActive !== undefined) parts.push(`isActive=${params.isActive}`);
  if (params.sortBy) parts.push(`sortBy=${params.sortBy}`);
  if (params.sortOrder) parts.push(`sortOrder=${params.sortOrder}`);
  if (params.skipCount !== undefined) parts.push(`skipCount=${params.skipCount}`);
  if (params.maxResultCount !== undefined) parts.push(`maxResultCount=${params.maxResultCount}`);
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

export async function getEmployees(
  params: EmployeeQueryParams = {}
): Promise<EmployeeListResponse> {
  const query = buildQueryString(params);
  const res = await axiosInstance.get<EmployeeListResponse>(
    `${endpoints.employee.list}${query}`
  );
  return res.data;
}

export async function getEmployeeById(id: string): Promise<Employee> {
  const res = await axiosInstance.get<Employee>(endpoints.employee.single(id));
  return res.data;
}

function buildCreateFormData(payload: CreateEmployeePayload): FormData {
  const fd = new FormData();
  fd.append('Name', payload.name);
  fd.append('Email', payload.email);
  fd.append('PhoneNumber', payload.phoneNumber);
  fd.append('Gender', payload.userGender);
  fd.append('Password', payload.password);
  fd.append('ConfirmPassword', payload.confirmPassword);
  fd.append('IsActive', String(payload.isActive));
  fd.append('ProfileImage', payload.profileImage ?? 'null');
  return fd;
}

function buildUpdateFormData(payload: UpdateEmployeePayload): FormData {
  const fd = new FormData();
  if (payload.name !== undefined) fd.append('Name', payload.name);
  if (payload.email !== undefined) fd.append('Email', payload.email);
  if (payload.phoneNumber !== undefined) fd.append('PhoneNumber', payload.phoneNumber);
  if (payload.userGender !== undefined) fd.append('Gender', payload.userGender);
  if (payload.isActive !== undefined) fd.append('IsActive', String(payload.isActive));
  fd.append('ProfileImage', payload.profileImage ?? 'null');
  return fd;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const formData = buildCreateFormData(payload);
  const res = await axiosInstance.post<Employee>(endpoints.employee.create, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateEmployee(
  id: string,
  payload: UpdateEmployeePayload
): Promise<Employee> {
  const formData = buildUpdateFormData(payload);
  const res = await axiosInstance.put<Employee>(endpoints.employee.patch(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await axiosInstance.delete(endpoints.employee.delete(id));
}

export async function toggleEmployeeStatus(
  id: string,
  isActive: boolean
): Promise<Employee> {
  const currentEmployee = await getEmployeeById(id);

  const formData = new FormData();
  formData.append('Name', currentEmployee.name || '');
  formData.append('Email', currentEmployee.email || '');
  formData.append('PhoneNumber', currentEmployee.phoneNumber || '');
  formData.append('Gender', currentEmployee.userGender || '');
  formData.append('IsActive', String(isActive));
  formData.append('ProfileImage', currentEmployee.profileImage || 'null');

  const res = await axiosInstance.put<Employee>(
    endpoints.employee.patch(id),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return res.data;
}
