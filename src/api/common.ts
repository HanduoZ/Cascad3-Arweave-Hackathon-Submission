import { fetch } from 'src/fetch/intercept';
import { apiHost } from 'src/fetch/variable';

/** 上传 */
export function uploadImage(params: FormData) {
  return fetch.post<{ itemId: string }>(
    `${apiHost}/cascad3-ar/uploadImage`,
    params
  );
}

/** index：网站，articleItem，文章详情，about:关于，howToStart:如何开始 */
type PageName = 'index' | 'articleItem' | 'about' | 'howToStart' | string;

export interface PageNameTetaRes {
  title: string;
  description: string;
  imageUrl: string;
}
/** 页面meta */
export function pageMetaInfoReq(params: {
  /** index：网站，articleItem，文章详情，about:关于，howToStart:如何开始 */
  pageName: PageName;
  /** 文章id 详情 */
  itemId?: string;
}) {
  return fetch
    .get<ApiResData<PageNameTetaRes>>('/client/home/article/metaHeadInfo', {
      params,
    })
    .then((res) => {
      return res.data.data;
    });
}
