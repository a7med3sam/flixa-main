import { paths } from 'src/routes/paths';

export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;
export const HOST_API = process.env.NEXT_PUBLIC_HOST_API || '';

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.main;

export const MAX_FILE_SIZE = 500 * 1024; // 500KB
export const MAX_FILE_SIZE_HELPER = true;
