import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface CascadeUsageItem {
  /**
   * id
   */
  id: number;
  /**
   * 名称
   */
  name: string;
}

/** 空间使用途径 */
export default function useCascadeUsagesReq() {
  return useSWR('/client/common/cascadeUsages', (url) =>
    fetch.get<ApiResData<CascadeUsageItem[]>>(url).then((res) => {
      return res.data.data;
    })
  );
}
