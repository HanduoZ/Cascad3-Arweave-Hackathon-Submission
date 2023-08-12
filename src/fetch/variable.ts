import { IS_TEST } from 'src/utils/statics';

export const apiHost =
  process.env.NEXT_PUBLIC_API_HOST ?? 'https://api.cascad3.com';
// process.env.NEXT_PUBLIC_API_HOST ?? "https://www.pxks.online";

export const project = process.env.NEXT_PUBLIC_PROJECT;

export const baseURL =
  apiHost + (IS_TEST ? '/cascad3-client-test' : '/cascad3-client');

// 基础配置
export const BASE_CONFIG = {
  baseURL,
};
