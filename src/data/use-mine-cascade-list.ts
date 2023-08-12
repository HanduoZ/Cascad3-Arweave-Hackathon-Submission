import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface CascadeList {
  /**
   * 文章分成保留比例
   */
  taxRatio: number;
  /**
   * 唯一标识，用于二级域名
   */
  cascadeId: string;
  /**
   * 首图url
   */
  coverUrl: string;
  /**
   * 创建者id
   */
  creatorId: number;
  /**
   * 描述
   */
  description: string;
  /**
   * 数据库id
   */
  id: number;
  /**
   * logo的url
   */
  logoUrl: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 在空间中的角色：-1：未关注空间的用户，0：空间创建者，10： 管理员，20:关注空间的用户
   */
  role: number;
  /**
   * 金库钱包地址
   */
  treasuryAddress: string;
}

/** 我的空间列表 */
export default function useMineCascadeListReq() {
  return useSWR('/client/user/cascade/list', (url) =>
    fetch.get<ApiResData<CascadeList[]>>(url).then((res) => {
      return res.data.data;
    })
  );
}
