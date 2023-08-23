import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface CascadeDetailData {
  /**
   * arId
   */
  arId: string;
  arIdUrl: string;
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
   * 创建者名字
   */
  creatorUsername: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 数据库id
   */
  id: number;
  /**
   * 是否是web3的空间
   */
  isWeb3: boolean;
  /**
   * logo的url
   */
  logoUrl: string;
  /**
   * 成员数量
   */
  memberCount: number;
  /**
   * 名称
   */
  name: string;
  /**
   * 已发布作品的总数
   */
  pieceCount: number;
  /**
   * 作品是否必须有上游
   */
  pieceHaveUpstream: boolean;
  /**
   * 在空间中的角色：-1：未关注空间的用户，0：空间创建者，10： 管理员，20:关注空间的用户
   */
  role: number;
  /**
   * 空间税率
   */
  taxRatio: number;
  /**
   * 金库的总金额
   */
  tokenAmount: number;
  /**
   * 总流量
   */
  totalStream: number;
  /**
   * 金库钱包地址
   */
  treasuryAddress: string;
}

/** 空间详情 */
export default function useCascadeDetailReq(cascadeId: string) {
  return useSWR(
    cascadeId ? ['/client/cascade/home/enter', cascadeId] : null,
    ([url, cascadeId]) =>
      fetch
        .get<ApiResData<CascadeDetailData>>(url, {
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
