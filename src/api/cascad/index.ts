import type { CascadeDetailData } from 'src/data/use-cascade-detail';
import { fetch } from 'src/fetch/intercept';

export interface CascadeInfo {
  /**
   * 文章分成保留比例
   */
  taxRatio: number;
  /**
   * 唯一标识，用于二级域名
   */
  cascadeId: string;
  /**
   * 首图url
   */
  coverUrl: string;
  /**
   * 创建者id
   */
  creatorId: number;
  /**
   * 描述
   */
  description: string;
  /**
   * 数据库id
   */
  id: number;
  /**
   * logo的url
   */
  logoUrl: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 在空间中的角色：-1：未关注空间的用户，0：空间创建者，10： 管理员，20:关注空间的用户
   */
  role: number;
  /**
   * 金库钱包地址
   */
  treasuryAddress: string;
}

/** 创建空间 */
export function createCascadReq(params: {
  /**
   * 空间使用途径的名称
   */
  cascadeUsage?: string;
  /**
   * 空间使用途径
   */
  cascadeUsageIds?: number[];
  /**
   * 首图url
   */
  coverUrl?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 是否是web3的空间
   */
  isWeb3?: boolean;
  /**
   * logo的url
   */
  logoUrl?: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 作品是否必须有上游
   */
  pieceHaveUpstream?: boolean;
  /**
   * 空间税率
   */
  taxRatio: number;
  /**
   * 金库钱包地址
   */
  treasuryAddress: string;
}) {
  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/user/cascade/create',
    params
  );
}

/** 新建about */
export function createCascadAboutReq(content: string, cascadeId: string) {
  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/cascade/su/about/edit',
    {
      content,
    },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}

/** 新建tag */
export function createCascadTagReq(
  params: {
    tag: string;
    tagColor: string;
    id?: number;
  },
  cascadeId: string
) {
  return fetch.post<ApiResData<TagInfo>>(
    '/client/cascade/su/tag/edit',
    params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}

/** 删除tag */
export function delCascadTagReq(id: number, cascadeId: string) {
  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/cascade/su/tag/changeDeletedState',
    {
      id,
    },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}

interface UpdateCascadParams {
  /**
   * 名称
   */
  name: string;
  /**
   * 作品分成保留比例
   */
  taxRatio: number;
  /**
   * 金库钱包地址
   */
  treasuryAddress: string;
  /**
   * 首图url
   */
  coverUrl?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * logo的url
   */
  logoUrl?: string;
}

/** 编辑空间 */
export function updateCascadeReq(
  params: UpdateCascadParams,
  cascadeId: string
) {
  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/cascade/su/updateCascadeInfo',
    params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}

/** 空间详情用于seo */
export function cascadeInfoReq(cascadeId: string) {
  return fetch.get<ApiResData<CascadeDetailData>>(
    '/client/cascade/home/enter',
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}

/** 关注空间 */
export function followReq(id: number) {
  return fetch.post<ApiResData<boolean>>('/client/user/cascade/follow', {
    id,
  });
}

/** 取消关注空间 */
export function unFollowReq(id: number) {
  return fetch.post<ApiResData<boolean>>('/client/user/cascade/unfollow', {
    id,
  });
}
