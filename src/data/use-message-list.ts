import { fetch } from '../fetch/intercept';
import { useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

/**
 * ClientUserMessageInfo
 */
export interface ClientUserMessageInfo {
  /**
   * 消息体
   */
  content: string;
  /**
   * 创建时间
   */
  createTime: Date;
  /**
   * id
   */
  id: number;
  /**
   * 已读
   */
  isRead: boolean;
  /**
   * 消息类型：3：登录奖励发放 10: 收到打赏
   */
  type: number;
}

/** 消息分页 */
export default function useMessageListReq(params: { pageSize: number }) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/user/msg/page', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<ClientUserMessageInfo>>>(url, {
          params: {
            pageSize: params.pageSize,
            pageIndex,
          },
        })
        .then((res) => {
          setTotal(res.data.data?.totalRecords || 0);
          return res.data.data?.data || [];
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
