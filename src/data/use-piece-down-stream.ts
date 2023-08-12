import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';

/**
 * PieceStreamInfo
 */
export interface PieceStreamInfo {
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
  uuid: string;
  /** 是否featured */
  featured: boolean;
  /** 被打赏的数量 */
  rewardAmount: number;
  /** 点赞数量 */
  likeCount: number;
  /** 是否点赞 */
  isLike: boolean;
  /** 比例 */
  ratio: number;
}

/** 文章下游 */
export default function usePieceDownStreamReq(params: {
  pageSize: number;
  cascadeId: string;
  pieceUuid?: string;
}) {
  return useSWRInfinite(
    (index) =>
      params.pieceUuid && params.cascadeId
        ? ['/client/cascade/home/downstreamPieces', index + 1, params]
        : null,
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<PieceStreamInfo>>>(url, {
          params: {
            pieceUuid: params.pieceUuid,
            pageIndex: pageIndex,
            pageSize: params.pageSize,
          },
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId: params.cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data.data || [];
        }),
    {
      revalidateFirstPage: false,
    }
  );
}
