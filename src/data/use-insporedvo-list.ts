import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface InspiredVOListData {
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
   * 标题
   */
  title: string;
}

/** 启发上游 */
export default function useInspiredVOListReq(cascadeId: string) {
  return useSWR(
    cascadeId ? ['/client/cascade/user/piece/searchUpstream', cascadeId] : null,
    ([url, cascadeId]) =>
      fetch
        .get<ApiResData<InspiredVOListData[]>>(url, {
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
