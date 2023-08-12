import useSWR from 'swr';
import { fetch } from '../fetch/intercept';
/**
 * PieceCardInfo
 */
export interface PieceCardInfo {
  /**
   * 作者姓名
   */
  authorUsername: string;
  /**
   * 评论数量
   */
  commentCount: number;
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
  createTime: Date;
  /**
   * 被置顶了
   */
  featured: boolean;
  /**
   * id
   */
  id: number;
  /**
   * 是否点赞过
   */
  isLike: boolean;
  /**
   * 点赞数量
   */
  likeCount: number;
  /**
   * 阅读量
   */
  readCount: number;
  /**
   * 被打赏的数量
   */
  rewardAmount: number;
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
}
/**
 * 获取星图 数据
 * @param params
 * @returns
 */
export default function usePieceCardInfoReq(params: {
  cascadeId: string;
  pieceUuid: string;
}) {
  return useSWR(
    params.cascadeId && params.pieceUuid
      ? ['/client/cascade/home/pieceCardInfo', params]
      : null,
    ([url, params]) =>
      fetch
        .get<ApiResData<PieceCardInfo>>(url, {
          params: {
            pieceUuid: params.pieceUuid,
          },
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId: params.cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
