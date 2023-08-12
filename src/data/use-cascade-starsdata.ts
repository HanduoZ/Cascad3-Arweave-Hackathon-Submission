import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

/**
 * StarInfo
 */
export interface StarInfo {
  /**
   * edges
   */
  edges: StarEdge[];
  /**
   * nodes
   */
  nodes: StarNode[];
}

/**
 * StarEdge
 */
export interface StarEdge {
  /**
   * ratio
   */
  ratio: number;
  /**
   * source
   */
  source: string;
  /**
   * target
   */
  target: string;
}

/**
 * StarNode
 */
export interface StarNode {
  /**
   * 作者姓名
   */
  authorUsername: string;
  /**
   * 评论数量
   */
  commentCount: number;
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * 创建人id
   */
  createBy: number;
  /**
   * 创建时间
   */
  createTime: Date;
  /**
   * 下游作品的数量
   */
  downstreamCount: number;
  /**
   * 被置顶了
   */
  featured: boolean;
  /**
   * id
   */
  id: string;
  /**
   * 是否点赞过
   */
  isLike: boolean;
  /**
   * 是否已读
   */
  isRead: boolean;
  /**
   * 点赞数量
   */
  likeCount: number;
  /**
   * 被打赏的数量
   */
  rewardAmount: number;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * 标签列表
   */
  tagInfos: PieceTagInfo[];
  /**
   * 创建时间的等级，用于节点透明度的设置
   */
  timeLevel: number;
  /**
   * 标题
   */
  title: string;
  /**
   * uuid
   */
  uuid: string;
}


/**
 * PieceTagInfo
 */
export interface PieceTagInfo {
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
}
/**
 * 获取星图 数据
 * @param params
 * @returns
 */
export default function useStarsDataReq(params: { cascadeId: string }) {
  return useSWR(
    params.cascadeId ? ['/client/cascade/home/starsData', params] : null,
    ([url, params]) =>
      fetch
        .get<ApiResData<StarInfo>>(url, {
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId: params.cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
