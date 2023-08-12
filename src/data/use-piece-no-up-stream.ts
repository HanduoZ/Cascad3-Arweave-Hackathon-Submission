import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { useMemo, useState } from 'react';

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
  /**
   * uuid
   */
  uuid: string;
  featured: boolean;
}

/** 无上游作品 */
export default function useNoPieceUpStreamReq(params: {
  cascadId: string;
  pageSize: number;
}) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) =>
      params.cascadId
        ? ['/client/cascade/home/noUpstreamPieces', index + 1, params]
        : null,
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<PieceStreamInfo>>>(url, {
          params: {
            pageIndex: pageIndex,
            pageSize: params.pageSize,
          },
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId: params.cascadId }),
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
