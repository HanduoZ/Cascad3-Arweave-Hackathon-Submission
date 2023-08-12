import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface CascadeUserInfo {
  /**
   * 个人描述
   */
  bio: string;
  /**
   * 日上链id
   */
  dailyStreamArId: string;
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
  inStream: number;
  /**
   * 流出量
   */
  outStream: number;
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
}

/** 用户详情 */
export default function useCascadeUserInfoReq({
  userId,
  cascadeId,
}: {
  userId: string;
  cascadeId: string;
}) {
  return useSWR(
    userId && cascadeId
      ? ['/client/cascade/user/home/userInfo', userId, cascadeId]
      : null,
    ([url, userId, cascadeId]) =>
      fetch
        .get<ApiResData<CascadeUserInfo>>(url, {
          params: {
            userId,
          },
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
