'use server';

import { cookies, headers } from 'next/headers';

import { HOST_API } from 'src/config-global';
import { ApiErrorResponse, ApiResponse, RequestOptions } from 'src/types/crud-types';

const DEFAULT_API_BASE = 'https://api-staging.flexapay.io';

function flattenHeaders(headersMap?: Record<string, string | string[]>): Record<string, string> {
  if (!headersMap) return {};

  return Object.fromEntries(
    Object.entries(headersMap).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(', ') : value,
    ])
  );
}

function resolveUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const apiPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;
  const base = (HOST_API || DEFAULT_API_BASE).replace(/\/$/, '');

  return `${base}${apiPath}`;
}

function parseErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;

  const data = payload as Record<string, unknown>;

  if (typeof data.error === 'string') return data.error;
  if (typeof data.message === 'string') return data.message;

  if (data.error && typeof data.error === 'object') {
    const nested = data.error as Record<string, unknown>;
    if (typeof nested.message === 'string') return nested.message;
  }

  return fallback;
}

async function buildRequestHeaders(
  body?: BodyInit | null,
  extraHeaders?: Record<string, string | string[]>
): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const token = cookieStore.get('accessToken')?.value;
  const acceptLanguage = requestHeaders.get('accept-language')?.split(',')[0] || 'en-US';

  const result: Record<string, string> = {
    Accept: 'application/json',
    'Accept-Language': acceptLanguage,
    ...flattenHeaders(extraHeaders),
  };

  if (token) {
    result.Authorization = `Bearer ${token}`;
  }

  if (body && !(body instanceof FormData)) {
    result['Content-Type'] = 'application/json';
  }

  return result;
}

async function request<TResponse>(
  endpoint: string,
  init: RequestInit,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  try {
    const url = resolveUrl(endpoint);
    const requestHeaders = await buildRequestHeaders(init.body, options?.headers);

    const response = await fetch(url, {
      ...init,
      headers: requestHeaders,
      cache: options?.cache ?? 'no-store',
      next: options?.tags ? { tags: options.tags } : undefined,
    });

    const contentType = response.headers.get('content-type');
    const payload = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: parseErrorMessage(payload, response.statusText || 'Request failed'),
        status: response.status,
        code:
          typeof payload === 'object' && payload !== null
            ? (payload as Record<string, unknown>).code
            : undefined,
        details:
          typeof payload === 'object' && payload !== null
            ? (payload as Record<string, unknown>).details
            : payload,
        data:
          typeof payload === 'object' && payload !== null
            ? (payload as Record<string, unknown>).data
            : null,
        validationErrors:
          typeof payload === 'object' && payload !== null
            ? (payload as Record<string, unknown>).validationErrors
            : undefined,
      };

      return errorResponse;
    }

    return {
      success: true,
      data: payload as TResponse,
      meta: undefined,
      message:
        typeof payload === 'object' &&
        payload !== null &&
        typeof (payload as Record<string, unknown>).message === 'string'
          ? ((payload as Record<string, unknown>).message as string)
          : 'Success',
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error',
      status: 'network_error',
      code: undefined,
      details: error,
      data: null,
      validationErrors: undefined,
    };
  }
}

export async function getData<TResponse>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  return request<TResponse>(endpoint, { method: 'GET' }, options);
}

export async function postData<TResponse, TBody>(
  endpoint: string,
  data?: TBody,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  const body =
    data instanceof FormData ? data : data !== undefined ? JSON.stringify(data) : undefined;

  return request<TResponse>(endpoint, { method: 'POST', body }, options);
}

export async function editData<TResponse, TBody>(
  endpoint: string,
  method: 'PUT' | 'PATCH',
  data?: TBody,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  const body =
    data instanceof FormData ? data : data !== undefined ? JSON.stringify(data) : undefined;

  return request<TResponse>(endpoint, { method, body }, options);
}

export async function deleteData<TResponse>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<TResponse>> {
  return request<TResponse>(endpoint, { method: 'DELETE' }, options);
}
