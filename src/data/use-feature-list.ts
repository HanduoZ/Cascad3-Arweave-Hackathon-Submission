import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface FeatureList {
  /**
   * 作者姓名
   */
  authorUsername: string;
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
  createTime: Date;
  /**
   * 下游作品的数量
   */
  downstreamCount: number;
  /**
   * id
   */
  id: number;
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
  featured: boolean;
  uuid: string;
}

/** feature作品列表 */
export default function useFeatureListReq(cascadeId: string) {
  return useSWR(
    cascadeId ? ['/client/cascade/home/cascadeFeatureList', cascadeId] : null,
    ([url, cascadeId]) =>
      fetch
        .get<ApiResData<FeatureList[]>>(url, {
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
