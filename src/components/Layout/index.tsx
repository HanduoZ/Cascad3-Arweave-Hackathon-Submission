import { Button } from 'antd';
import { ReactNode } from 'react';
import { ReactComponent as MenuIcon } from 'src/assets/media/svg/icon-menu.svg';
import { ReactComponent as Logo } from 'src/assets/media/svg/logo.svg';
import { ReactComponent as AddCascadIcon } from 'src/assets/media/svg/icon-add-cascad.svg';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useUserInfo from 'src/hooks/use-user-info';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { homeScroll } from 'src/recoil/homeScroll';
import { drawerOpen } from 'src/recoil/collaps';
import DrawerCom from '../DrawerCom';
import User from '../User';

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const CBUrl = router.query.cburl as string;
  /** hook */
  const { data: userInfo } = useUserInfo();

  const setDrawerOpenRecoil = useSetRecoilState(drawerOpen);

  const isHomeScroll = useRecoilValue(homeScroll);

  return (
    <div className="h-full flex  select-none ">
      <DrawerCom />
      <div className="flex-1 flex flex-col relative">
        <div className="z-[999]">
          <Button
            type="text"
            icon={<MenuIcon />}
            onClick={() => {
              setDrawerOpenRecoil(true);
            }}
            className="w-[64px] h-[64px] !absolute left-8 top-6"
          />
          <div
            className={`h-[95px] shrink-0 flex items-center justify-between pr-[54px]] pl-[116px] pr-8`}
            style={{ background: `rgba(255,255,255,${isHomeScroll})` }}
          >
            <Link href="/">
              <Logo className="cursor-pointer relative top-1" />
            </Link>
            {!userInfo ? (
              router.pathname !== '/login' && (
                <Link
                  href={
                    router.pathname === '/' || router.pathname === '/forget'
                      ? '/login'
                      : `/login?cburl=${CBUrl || router.asPath}`
                  }
                >
                  <div
                    className={`px-4 h-[40px] btn rounded-[20px] bg-[#BAF9C140] bg-opacity-25 mr-[54px]`}
                  >
                    LOG IN/SIGN UP
                  </div>
                </Link>
              )
            ) : (
              <div className={`flex items-center`}>
                <Link href="/create">
                  <div className="bg-white">
                    <div
                      className={`px-4 cursor-pointer h-[40px] text-first border border-[#25BE224D] duration-300 rounded-[20px] bg-[rgba(37,190,34,0.25)] hover:bg-[rgba(37,190,34,0.45)] shadow-[3px_3px_2px_0_#BAF9C1] hover:shadow-[2px_2px_2px_0_#BAF9C1] flex items-center`}
                    >
                      CREATE CASCADE
                      <AddCascadIcon className="ml-1" />
                    </div>
                  </div>
                </Link>
                <User />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
export default Layout;
