import { useEffect, useState } from 'react';
import { ReactComponent as BackIcon } from 'src/assets/media/svg/icon-back.svg';
import { useRouter } from 'next/router';
import useCascadInfo from 'src/hooks/use-cascad-info';

import useRouterParams from 'src/hooks/use-router-params';
import Posts from './Posts';
import Users from './Users';
import General from './General';
import TagSetting from './TagSetting';
import ExternalLinks from './ExternalLinks';

/** 左侧菜单 */
export const leftMenu = [
  {
    value: '0',
    label: 'Posts',
    component: <Posts />,
  },
  {
    value: '1',
    label: 'Users',
    component: <Users />,
  },
  {
    value: '2',
    label: 'General',
    component: <General />,
  },
  {
    value: '3',
    label: 'Tag Setting',
    component: <TagSetting />,
  },
  {
    value: '4',
    label: 'External Links',
    component: <ExternalLinks />,
  },
  // {
  //   value: '5',
  //   label: 'Access Policy',
  //   component: createElement(AccessPolicy),
  // },
];

const CascadSetting = () => {
  const router = useRouter();
  const menu = router.query.menu as string;
  const { cascadId } = useRouterParams();

  const [checkValue, setCheckValue] = useState('0');

  /** hook-空间详情 */
  const { cascadDetail } = useCascadInfo();

  /** 权限判断 */
  useEffect(() => {
    if (cascadDetail && cascadDetail?.role !== 0 && cascadDetail?.role !== 10) {
      router.push(`/${cascadId}`);
    }
  }, [cascadDetail, cascadId, router]);

  /** 设置链接数据 */
  useEffect(() => {
    if (menu) setCheckValue(menu);
  }, [menu]);

  return (
    <div className="flex h-full pt-7">
      <div className="w-[382px] pt-6 overflow-y-auto pl-8 mb-8 border-r-[1px] border-border">
        <BackIcon
          onClick={() => router.back()}
          className="cursor-pointer hover:text-[#000] transition duration-300 ease-in-out"
        />
        <div className="text-first font-medium text-[22px] leading-[26px] mt-10">
          Cascade Setting
        </div>
        {leftMenu.map((item, index) => (
          <div
            key={item.value}
            className={`py-[22px] mr-9 border-b-[1px] border-border text-[18px] ${
              checkValue === item.value ? 'underline font-medium' : ''
            } ${index === 0 ? 'border-t-[1px] mt-8' : ''}`}
          >
            <span
              className="cursor-pointer"
              onClick={() => {
                setCheckValue(item.value);
                router.replace(
                  `${router.asPath.split('?')[0]}?menu=${item.value}`
                );
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1 h-full overflow-y-auto pt-[60px] pl-[100px] pr-[72px]">
        {leftMenu.find((item) => checkValue === item.value)?.component}
      </div>
    </div>
  );
};
export default CascadSetting;
