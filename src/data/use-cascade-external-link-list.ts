import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface CascadeExternalLinkInfo {
  /**
   * 图片url
   */
  iconUrl: string;
  /**
   * id
   */
  id: number;
  /**
   * 链接
   */
  link: string;
  /**
   * 名称
   */
  name: string;
}

/** 空间额外链接 */
export default function useExternalLinksReq(cascadeId: string) {
  return useSWR(
    cascadeId ? ['/client/cascade/home/externalLinks', cascadeId] : null,
    ([url, cascadeId]) =>
      fetch
        .get<ApiResData<CascadeExternalLinkInfo[]>>(url, {
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
