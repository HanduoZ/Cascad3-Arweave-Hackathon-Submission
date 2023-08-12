import axios from 'axios';
import createError from './createError';
import { BASE_CONFIG } from './variable';
import { TOKEN } from 'src/utils/statics';

const fetch = axios.create(BASE_CONFIG);

fetch.interceptors.request.use(function (config: any) {
  if (typeof window !== 'undefined') {
    const authorization = localStorage.getItem(TOKEN);
    config.headers.authorization = `Bearer ${authorization}`;
  }
  return config;
});

fetch.interceptors.response.use(function (response: any) {
  /** 403 :未登录 */
  if (
    response.data.status !== 1 &&
    response.data.status !== 403 &&
    !response.data.itemId
  ) {
    return Promise.reject(
      createError(
        response.data.msg,
        response.config,
        response.data.status,
        response
      )
    );
  }
  return response;
});

export { fetch };
