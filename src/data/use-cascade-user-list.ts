import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { useMemo, useState } from 'react';

/**
 * UserInAdminInfo
 */
export interface UserInAdminInfo {
  /**
   * 邮箱 唯一
   */
  email: string;
  /**
   * 头像
   */
  faceUrl: string;
  /**
   * id
   */
  id: number;
  /**
   * 在空间中的角色：-1：未关注空间的用户，0：空间创建者，10： 管理员，20:关注空间的用户
   */
  role: number;
  /**
   * 用户名 唯一
   */
  username: string;
  /**
   * 钱包地址 唯一
   */
  walletAddress: string;
}

interface CascadeUserListParams {
  /**
   * 每页显示记录数
   */
  pageSize: number;
  cascadId: string;
  /**
   * 搜索的关键字
   */
  keyword?: string;
  /**
   * 在空间中的角色：0：空间创建者，10： 管理员，20:关注空间的用户
   */
  role?: number;
}

/** 空间用户列表 */
export default function useCascadeUserListReq(params: CascadeUserListParams) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return ['/client/cascade/su/user/page', index + 1, params];
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<UserInAdminInfo>>>(url, {
          params: {
            ...params,
            pageIndex,
          },
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId: params.cascadId }),
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
