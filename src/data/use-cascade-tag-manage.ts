import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface CascadeTagManageInfo {
  /**
   * id
   */
  id: number;
  /**
   * tag名称
   */
  tag: string;
  /**
   * 背景色
   */
  tagColor: string;
  isDeleted: boolean;
}

/** 空间 tag 管理 */
export default function useCascadeTagManageReq(cascadeId: string) {
  return useSWR(
    cascadeId ? ['/client/cascade/su/tag/list', cascadeId] : null,
    ([url, cascadeId]) =>
      fetch
        .get<ApiResData<CascadeTagManageInfo[]>>(url, {
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
