import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface PieceForEditInfo {
  /**
   * 内容
   */
  content: string;
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * id
   */
  id: number;
  /**
   * 是否已经发布过？发布后的作品不能编辑上游列表
   */
  isPublished: boolean;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * 标签Ids
   */
  tagSet: number[];
  /**
   * 标题
   */
  title: string;
  upstreamPieceList: PieceUpstreamInfo[];
  /**
   * uuid
   */
  uuid: string;
}

/**
 * PieceUpstreamInfo
 */
export interface PieceUpstreamInfo {
  /**
   * 作者姓名
   */
  authorUsername: string;
  /**
   * 创建人id
   */
  createBy: number;
  /**
   * id
   */
  id: number;
  /**
   * 比例
   */
  ratio: number;
  /**
   * 标题
   */
  title: string;
  /**
   * uuid
   */
  uuid: string;
}

/** 编辑-文章详情 */
export default function usePieceDraftDetailReq(
  pieceUuid: string,
  cascadeId: string
) {
  return useSWR(
    pieceUuid && cascadeId
      ? ['/client/cascade/user/piece/draftDetail', pieceUuid, cascadeId]
      : null,
    ([url, pieceUuid, cascadeId]) =>
      fetch
        .get<ApiResData<PieceForEditInfo>>(url, {
          params: {
            pieceUuid,
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
