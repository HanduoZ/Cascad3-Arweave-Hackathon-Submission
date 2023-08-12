import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

/** 空间about */
export default function useCascadeAboutReq(cascadeId: string) {
  return useSWR(
    cascadeId ? ['/client/cascade/home/cascadeAbout', cascadeId] : null,
    ([url, cascadeId]) =>
      fetch
        .get<ApiResData<string>>(url, {
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
