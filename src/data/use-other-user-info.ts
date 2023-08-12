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
  rewardAmount: number;
  likeCount: number;
  isLike: boolean;
}

/** 个人中心分享 */
export default function useOtherUserPieceReq(params: {
  pageSize: number;
  cascadeId: string;
  userId: string;
}) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) =>
      params.cascadeId && params.userId
        ? ['/client/cascade/user/home/pagePiece', index + 1, params]
        : null,
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<PieceInUserProfileInfo>>>(url, {
          params: {
            pageIndex: pageIndex,
            pageSize: params.pageSize,
            userId: params.userId,
          },
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId: params.cascadeId }),
          },
        })
        .then((res) => {
          setTotal(res.data.data?.totalRecords || 0);
          return res.data.data.data || [];
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
