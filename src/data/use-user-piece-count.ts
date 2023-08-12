import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

/** Personalcenter Posts 数量 */
// export default function usePieceCountReq() {
//   return useSWR('/client/cascade/user/piece/pieceCount', (url) =>
//     fetch.get<ApiResData<number>>(url).then((res) => {
//       console.log("pieceCount",res.data)
//       return res.data.data || 0;
//     })
//   );
// }

export default function usePieceCountReq(params: {
  cascadId: string}) {
  return useSWR(
    params.cascadId
      ? ['/client/cascade/user/piece/pieceCount', params]
      : null,
    ([url, params]) =>
      fetch
        .get<ApiResData<number>>(url, {
          
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId: params.cascadId }),
          },
        })
        .then((res) => {
          return res.data.data || 0;
        })
  );
}
