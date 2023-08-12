import { createElement } from 'react';
import Posts from './Posts';
import Users from './Users';
import BasicSetting from './BasicSetting';
import TagSetting from './TagSetting';
import ExternalLinks from './ExternalLinks';

/** type */
export const statusType = [
  {
    text: 'Unread',
    value: '1',
  },
  {
    text: 'Published',
    value: '2',
  },
  {
    text: 'Taken-down',
    value: '3',
  },
];

/** 左侧菜单 */
export const leftMenu = [
  {
    value: '0',
    label: 'Posts',
    component: createElement(Posts),
  },
  {
    value: '1',
    label: 'Users',
    component: createElement(Users),
  },
  {
    value: '2',
    label: 'Basic Setting',
    component: createElement(BasicSetting),
  },
  {
    value: '3',
    label: 'Tag Setting',
    component: createElement(TagSetting),
  },
  {
    value: '4',
    label: 'External Links',
    component: createElement(ExternalLinks),
  },
  // {
  //   value: '5',
  //   label: 'Access Policy',
  //   component: createElement(AccessPolicy),
  // },
];

/** 空间角色 */
export const userRole = (role: number) => {
  switch (role) {
    case -1:
      return 'Tourist';
    case 0:
      return 'Cascad Creator';
    case 10:
      return 'Cascad Admin';
    default:
      return 'Cascad Follower';
  }
};

/** 颜色模版 */
export const colorTemplate = [
  {
    color: '#833B3B',
  },
  {
    color: '#A56D19',
  },
  {
    color: '#CAB71F',
  },
  {
    color: '#879A5D',
  },
  {
    color: '#5D9A64',
  },
  {
    color: '#5A8C93',
  },
  {
    color: '#13978F',
  },
  {
    color: '#20476A',
  },
  {
    color: '#6F5392',
  },
  {
    color: '#935A8A',
  },
  {
    color: '#535353',
  },
];
