import axios from 'axios';
import { decodeToken } from '../utils/decodeToken'; // make sure path correct

export const createAPI = (token) => {
  const instance = axios.create();

  instance.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // 🔥 decode token
      const decoded = decodeToken(token);

      config.headers["X-User-Id"] =
        decoded?.userId || decoded?.id || decoded?.sub;

      config.headers["X-User-Role"] =
        decoded?.role || "customer";
    }

    return config;
  });

  return instance;
};