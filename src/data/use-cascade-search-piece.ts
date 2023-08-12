import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

interface SearchPiecesParams {
  /**
   * keyword
   */
  keyword?: string;
  /**
   * lastId
   */
  lastId?: number;
  /**
   * pageSize
   */
  pageSize?: number;
  /**
   * tagId
   */
  tagId?: number;
}

/**
 * PieceSearchInfo
 */
export interface PieceSearchInfo {
  /**
   * id
   */
  id: number;
  /**
   * 标题
   */
  title: string;
  /**
   * uuid
   */
  uuid: string;
}

/** 搜索作品 */
export default function useSearchPiecesReq(
  params: SearchPiecesParams,
  cascadeId: string
) {
  return useSWR(
    params.keyword || params.tagId
      ? ['/client/cascade/home/searchPieces', params, cascadeId]
      : null,
    ([url, params, cascadeId]) =>
      fetch
        .get<ApiResData<PagingResData<PieceSearchInfo>>>(url, {
          params,
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
