'use server';

import { ApiResponse, ApiErrorResponse } from 'src/types/crud-types';

export async function getData<TResponse>(
  _endpoint: string,
  _options?: any
): Promise<ApiResponse<TResponse>> {
  return {
    success: true,
    data: {} as TResponse,
    meta: undefined,
    message: 'Mock success',
    status: 200,
  };
}

export async function postData<TResponse, _TBody>(
  _endpoint: string,
  _data?: _TBody,
  _options?: any
): Promise<ApiResponse<TResponse>> {
  return {
    success: true,
    data: {} as TResponse,
    meta: undefined,
    message: 'Mock success',
    status: 200,
  };
}

export async function editData<TResponse, _TBody>(
  _endpoint: string,
  _method: 'PUT' | 'PATCH',
  _data?: _TBody,
  _options?: any
): Promise<ApiResponse<TResponse>> {
  return {
    success: true,
    data: {} as TResponse,
    meta: undefined,
    message: 'Mock success',
    status: 200,
  };
}

export async function deleteData<TResponse>(
  _endpoint: string,
  _options?: any
): Promise<ApiResponse<TResponse>> {
  return {
    success: true,
    data: {} as TResponse,
    meta: undefined,
    message: 'Mock success',
    status: 200,
  };
}
