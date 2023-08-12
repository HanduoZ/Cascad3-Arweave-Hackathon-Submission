import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

/** 未读消息数量 */
export default function useUnreadMsgCountReq() {
  return useSWR('/client/user/msg/unreadMsgCount', (url) =>
    fetch.get<ApiResData<number>>(url).then((res) => {
      return res.data.data;
    })
  );
}
