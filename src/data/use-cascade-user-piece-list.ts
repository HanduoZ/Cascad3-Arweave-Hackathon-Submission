import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { useMemo, useState } from 'react';

export interface PieceInUserProfileInfo {
  /**
   * 作者姓名
   */
  authorUsername: string;
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * 创建人id
   */
  createBy: number;
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * 状态：0，草稿，10：发布，20：下架
   */
  currState: number;
  /**
   * 下游作品的数量
   */
  downstreamCount: number;
  /**
   * id
   */
  id: number;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * 标签列表
   */
  tagInfos: TagInfo[];
  /**
   * 标题
   */
  title: string;
  /**
   * uuid
   */
  uuid: string;
  /** 被打赏的数量 */
  rewardAmount: number;
  likeCount: number;
  isLike: boolean;
  /** 是否上链 */
  isOnChain: boolean;
  /** 比例 */
  ratio: number;
}

/** 空间个人中心 */
export default function useUserPieceReq(params: {
  pageSize: number;
  cascadeId: string;
  currState?: string;
}) {
  const [currentTotal, setCurrentTotal] = useState(0);
  const data = useSWRInfinite(
    (index) =>
      params.cascadeId
        ? ['/client/cascade/user/piece/pagePiece', index + 1, params]
        : null,
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<PieceInUserProfileInfo>>>(url, {
          params: {
            pageIndex: pageIndex,
            pageSize: params.pageSize,
            currState: params.currState,
          },
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId: params.cascadeId }),
          },
        })
        .then((res) => {
          setCurrentTotal(res.data.data?.totalRecords || 0);
          return res.data.data.data || [];
        }),
    {
      revalidateFirstPage: false,
    }
  );
  const result = useMemo(() => {
    return {
      ...data,

      currentTotal,
    };
  }, [currentTotal, data]);
  return result;
}
