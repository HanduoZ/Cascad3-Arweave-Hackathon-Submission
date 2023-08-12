import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { useMemo, useState } from 'react';

/**
 * CascadeInfo
 */
export interface CascadeInfo {
  arId: string;
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
  tokenAmount?: number;
  /**
   * 总流量
   */
  totalStream?: number;
  /**
   * 金库钱包地址
   */
  treasuryAddress: string;
}

/** 空间列表 */
export default function useCascadeListReq(params: {
  pageSize: number;
  keyword?: string;
}) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/home/cascadeList', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<CascadeInfo>>>(url, {
          params: {
            ...params,
            pageIndex,
          },
        })
        .then((res) => {
          setTotal(res.data.data?.totalRecords || 0);
          return res.data.data?.data || [];
        }),
    {
      // revalidateFirstPage: false,
    }
  );

  const result = useMemo(() => {
    return {
      ...data,
      total,
    };
  }, [data, total]);
  return result;
}
