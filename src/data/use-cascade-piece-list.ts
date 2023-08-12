import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { useMemo, useState } from 'react';

/**
 * PieceInAdminInfo
 */
export interface PieceInAdminInfo {
  /**
   * arId
   */
  arId: string;
  /**
   * 作者姓名
   */
  authorUsername: string;
  /**
   * 创建人id
   */
  createBy: number;
  /**
   * 状态：0，草稿，10：发布，20：下架
   */
  currState: number;
  /**
   * id
   */
  id: number;
  /**
   * 是否已经审阅过了
   */
  isReviewed: boolean;
  /**
   * 标题
   */
  title: string;
  /**
   * uuid
   */
  uuid: string;
  /** 是否上链 */
  isOnChain: boolean;
}

interface CascadePieceListParams {
  /**
   * 每页显示记录数
   */
  pageSize: number;
  cascadId: string;
  /**
   * 状态：0:all,1:unread,2:tbm,3:reviewed,4:takenDown
   */
  tabType: string;
  /**
   * 搜索的关键字
   */
  keyword?: string;
}

/** 空间作品列表 */
export default function useCascadePieceListReq(params: CascadePieceListParams) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.cascadId
        ? ['/client/cascade/su/piece/pagePiece', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<PieceInAdminInfo>>>(url, {
          params: {
            ...params,
            pageIndex,
          },
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId: params.cascadId }),
          },
        })
        .then((res) => {
          setTotal(res.data.data?.totalRecords || 0);
          return res.data.data?.data || [];
        }),
    {
      revalidateFirstPage: false,
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
