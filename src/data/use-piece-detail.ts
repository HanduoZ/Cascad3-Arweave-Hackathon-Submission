import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface PieceDetailData {
  /**
   * arId
   */
  arId: string;
  author: UserInfo;
  /**
   * 作者姓名
   */
  authorUsername: string;
  /**
   * 内容
   */
  content: string;
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * 创建人id
   */
  createBy: number;
  /**
   * 创建时间 yyyy-MM-dd HH:mm
   */
  createTime: number;
  /**
   * 状态：0，草稿，10:发布
   */
  currState: number;
  /**
   * 下游作品的数量
   */
  downstreamCount: number;
  /**
   * id
   */
  id: number;
  /**
   * 是否点赞过
   */
  isLike: boolean;
  /**
   * 点赞数量
   */
  likeCount: number;
  /**
   * 阅读量
   */
  readCount: number;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * 标签列表
   */
  tagInfos: TagInfo[];
  /**
   * 标题
   */
  title: string;
  upstreamPieceList: PieceUpstreamInfo[];
  uuid: string;
  /** 被打赏的数量 */
  rewardAmount: number;
  /** 比例 */
  ratio: number;
}

/**
 * UserInfo
 */
export interface UserInfo {
  /**
   * 个人描述
   */
  bio: string;
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
   * token的数量
   */
  tokenAmount: number;
  /**
   * 用户名 唯一
   */
  username: string;
  /**
   * 钱包地址 唯一
   */
  walletAddress: string;
}

/**
 * PieceUpstreamInfo
 */
export interface PieceUpstreamInfo {
  /**
   * 作者姓名
   */
  authorUsername: string;
  /**
   * 创建人id
   */
  createBy: number;
  /**
   * id
   */
  id: number;
  /**
   * 标题
   */
  title: string;
  /** 分润 */
  ratio: number;
}

/** 文章详情 */
export default function usePieceDetailReq(
  pieceUuid: string,
  cascadeId: string
) {
  return useSWR(
    pieceUuid && cascadeId
      ? ['/client/cascade/home/pieceInfo', pieceUuid, cascadeId]
      : null,
    ([url, pieceUuid, cascadeId]) =>
      fetch
        .get<ApiResData<PieceDetailData>>(url, {
          params: {
            pieceUuid,
          },
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
