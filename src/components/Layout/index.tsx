import { Avatar, Button, Drawer, Popover } from 'antd';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as MenuIcon } from 'src/assets/media/svg/icon-menu.svg';
import { ReactComponent as HomeIcon } from 'src/assets/media/svg/icon-home.svg';
import { ReactComponent as Logo } from 'src/assets/media/svg/logo.svg';
import { ReactComponent as AddCascadIcon } from 'src/assets/media/svg/icon-add-cascad.svg';
import CascadList from './CascadList';
import { useRouter } from 'next/router';
import styles from './index.module.less';
import Link from 'next/link';
import useUserInfo from 'src/hooks/use-user-info';
import useMineCascadeListReq from 'src/data/use-mine-cascade-list';
import useRouterParams from 'src/hooks/use-router-params';
import { useRecoilValue } from 'recoil';
import { homeScroll } from 'src/recoil/homeScroll';
import { UserOutlined } from '@ant-design/icons';
import UserInfo from '../UserInfo';
/** 显示cascad3 头部的路由 */
const showCascadeHeader = ['/', '/user'];

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const { cascadId } = useRouterParams();

  const { data: userInfo } = useUserInfo();

  const [collapsed, setCollapsed] = useState(false);

  /** 接口-空间列表 */
  const { data } = useMineCascadeListReq();

  const isHomeScroll = useRecoilValue(homeScroll);

  /** 空间列表 */
  const mineCascadList = useMemo(() => {
    if (data) {
      if (cascadId) {
        const arr = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].cascadeId === cascadId) {
            arr.unshift(data[i]);
          } else {
            arr.push(data[i]);
          }
        }
        return arr;
      } else {
        return data;
      }
    }
    return [];
  }, [cascadId, data]);

  /** 退出登录无侧边栏 */
  useEffect(() => {
    if (!userInfo) setCollapsed(false);
  }, [userInfo]);

  /** 关闭drawer */
  const onCloseDrawer = useCallback(() => {
    setCollapsed(false);
  }, []);

  return (
    <div className="h-full flex  select-none ">
      <Drawer
        placement="left"
        onClose={onCloseDrawer}
        width={116}
        open={collapsed}
        bodyStyle={{
          padding: 0,
        }}
        headerStyle={{
          display: 'none',
        }}
      >
        <div
          className={`w-[116px] h-[100vh] duration-300 shrink-0 py-8 flex flex-col overflow-hidden justify-between items-center bg-[#D9D9D9] `}
        >
          <CascadList data={mineCascadList} onCloseDrawer={onCloseDrawer} />
          <div className="flex shrink-0 flex-col mt-10 items-center">
            <HomeIcon
              className="cursor-pointer w-[50px] h-[50px]"
              onClick={() => {
                onCloseDrawer();
                router.push('/');
              }}
            />
          </div>
        </div>
      </Drawer>
      <div className="flex-1 flex flex-col relative">
        <div className="z-[999]">
          {userInfo && (
            <Button
              type="text"
              icon={<MenuIcon />}
              onClick={() => {
                setCollapsed(true);
              }}
              className="w-[64px] h-[64px] !absolute left-8 top-6"
            />
          )}
          {showCascadeHeader.includes(router.pathname) && (
            <div
              className={`h-[95px] shrink-0 flex items-center justify-between pr-[54px]] ${
                userInfo ? 'pl-[116px]' : 'pl-8'
              }
            `}
              style={{ background: `rgba(255,255,255,${isHomeScroll})` }}
            >
              <Link href="/">
                <Logo className="cursor-pointer relative top-1" />
              </Link>
              {!userInfo ? (
                <Link href="/login">
                  <div
                    className={`px-4 h-[40px] btn rounded-[20px] bg-[#BAF9C140] bg-opacity-25 mr-[54px]`}
                  >
                    LOG IN/SIGN UP
                  </div>
                </Link>
              ) : (
                <div className={`flex items-center`}>
                  <Link href="/create" target="_blank">
                    <div
                      className={`px-4 cursor-pointer h-[40px] mr-5 text-first border border-[#25BE224D] duration-300 rounded-[20px] bg-[rgba(37,190,34,0.25)] hover:bg-[rgba(37,190,34,0.45)] shadow-[3px_3px_2px_0_#BAF9C1] hover:shadow-[2px_2px_2px_0_#BAF9C1] flex items-center`}
                    >
                      CREATE CASCADE
                      <AddCascadIcon className="ml-1" />
                    </div>
                  </Link>
                  <Popover
                    placement="bottom"
                    content={<UserInfo />}
                    showArrow={false}
                    overlayClassName={styles.popover}
                  >
                    <Avatar
                      size={40}
                      className="cursor-pointer  !mr-[54px]"
                      src={userInfo?.faceUrl}
                      icon={<UserOutlined />}
                    />
                  </Popover>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
export default Layout;
