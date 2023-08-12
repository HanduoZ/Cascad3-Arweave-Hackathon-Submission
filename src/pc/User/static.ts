import { createElement } from 'react';
import Account from './Account';
// import Streams from './Streams';
import CreatorCenter from './CreatorCenter';

/** 左侧菜单 */
export const leftMenu = [
  {
    value: '0',
    label: 'Account',
    component: createElement(Account),
  },
  // {
  //   value: '1',
  //   label: 'My streams',
  //   component: createElement(Streams),
  // },
  {
    value: '2',
    label: 'Creator Center',
    component: createElement(CreatorCenter),
  },
];

/** type */
export const streamsType = [
  {
    text: 'Out-stream',
    value: '0',
  },
  {
    text: 'In-stream',
    value: '1',
  },
];
