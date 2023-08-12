import useSWR from 'swr';
import { fetch } from '../fetch/intercept';
/**
 * PieceStreamInfo
 */
export interface StreamInfo {
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
  createTime: Date;
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
  /** 是否是featured */
  featured: boolean;
  /** 比例 */
  ratio: number;
}

/** 文章上游 */
export default function usePieceUpStreamReq(params: {
  cascadId: string;
  pieceUuid?: string;
}) {
  return useSWR(
    params.pieceUuid && params.cascadId
      ? ['/client/cascade/home/upstreamPieces', params]
      : null,
    ([url, params]) =>
      fetch
        .get<ApiResData<StreamInfo[]>>(url, {
          params: {
            pieceUuid: params.pieceUuid,
          },
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId: params.cascadId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
