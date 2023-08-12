declare module 'quill-image-drop-module';
declare module '@editorjs/header';
declare module '@editorjs/paragraph';
declare module '@editorjs/image';
declare module '@editorjs/list';
declare module '@editorjs/embed';
declare module '@editorjs/checklist';
declare module '@editorjs/quote';
declare module '@editorjs/inline-code';
declare module '@editorjs/underline';
declare module '@editorjs/marker';
declare module '@editorjs/link';
declare module 'masonry-layout';
declare module 'compressorjs';
declare module 'react-responsive-masonry';
declare module 'react-helmet';
declare module 'editorjs-hyperlink';
declare module 'tinycolor2';

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}

interface Window {
  readonly sensorsDataAnalytic201505: any;
  ethereum: any;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_ROUTE_BASENAME: string;
    readonly NEXT_PUBLIC_API_HOST: string;
    readonly NEXT_PUBLIC_USER_API_HOST: string;
    readonly NEXT_PUBLIC_N_TOKEN: string;
  }
}

interface ApiResData<T> {
  data: T;
  status: number | string;
  msg: string;
}

interface PagingResData<T> {
  data: T[];
  /**
   * 最后一条数据的id
   */
  lastId: number;
  /**
   * 总共页数
   */
  pageCount: number;
  /**
   * 当前页码
   */
  pageIndex: number;
  /**
   * 每页显示记录数
   */
  pageSize: number;
  /**
   * 查询结果总记录数
   */
  totalRecords: number;
}

interface TagInfo {
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
