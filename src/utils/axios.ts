import axios, { AxiosRequestConfig } from 'axios';
import { HOST_API } from 'src/config-global';
import { getCookie, setCookie, removeCookie } from 'src/utils/cookie';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Set Accept-Language if needed
    const lang = localStorage.getItem('i18nextLng') || 'en-US';
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's an auth endpoint to prevent refresh loop
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh-token');

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${HOST_API}/api/v1/admin/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        setCookie('accessToken', accessToken, 7);
        setCookie('refreshToken', newRefreshToken, 30);

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        removeCookie('accessToken');
        removeCookie('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login'; // Or emit an event
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};
