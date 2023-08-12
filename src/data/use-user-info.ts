import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface UserInfo {
  /**
   * 个人描述
   */
  bio: string;
  /**
   * 邮箱 唯一
   */
  email: string;
  /**
   * 头像
   */
  faceUrl: string;
  /**
   * id
   */
  id: number;
  /**
   * 流入量
   */
  inStream?: number;
  /**
   * 流出量
   */
  outStream?: number;
  /**
   * token的数量
   */
  tokenAmount: number;
  /**
   * 用户名 唯一
   */
  username: string;
  /**
   * 钱包地址 唯一
   */
  walletAddress: string;
  /** 日上链 */
  dailyStreamArId: string;
}

/** user */
export default function useUserInfoReq() {
  return useSWR('/client/user/userInfo', (url) =>
    fetch.get<ApiResData<UserInfo>>(url).then((res) => {
      return res.data.data;
    })
  );
}
