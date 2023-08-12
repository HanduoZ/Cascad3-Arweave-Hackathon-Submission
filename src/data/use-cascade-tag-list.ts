import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

/** 空间 tag 列表 不带删除 */
export default function useCascadeTagListReq(cascadeId: string) {
  return useSWR(
    cascadeId ? ['/client/cascade/home/tags', cascadeId] : null,
    ([url, cascadeId]) =>
      fetch
        .get<ApiResData<TagInfo[]>>(url, {
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
