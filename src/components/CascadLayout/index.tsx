import Link from 'next/link';
import { ReactNode } from 'react';
import useUserInfo from 'src/hooks/use-user-info';
import { ReactComponent as WritingIcon } from 'src/assets/media/svg/icon-writing.svg';
import { ReactComponent as MenuIcon } from 'src/assets/media/svg/icon-menu.svg';
import { useRouter } from 'next/router';
import useRouterParams from 'src/hooks/use-router-params';
import { Button } from 'antd';
import CascadInfoProvider from './CascadInfoProvider';
import CascadeInfo from './CascadeInfo';
import DrawerCom from '../DrawerCom';
import { useSetRecoilState } from 'recoil';
import { drawerOpen } from 'src/recoil/collaps';
import User from '../User';

const CascadLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const { cascadId } = useRouterParams();

  const setDrawerOpenRecoil = useSetRecoilState(drawerOpen);

  /** hook */
  const { data: userInfo } = useUserInfo();

  return (
    <div className="h-full flex-1 flex flex-col overflow-hidden">
      <Button
        type="text"
        icon={<MenuIcon />}
        onClick={() => {
          setDrawerOpenRecoil(true);
        }}
        className="w-[64px] h-[64px] !absolute left-8 top-6"
      />
      <div
        className={`pl-[116px] pr-[54px] h-[80px] flex items-center justify-between`}
      >
        <DrawerCom />
        <CascadeInfo />
        <div className="flex shrink-0 items-center">
          {userInfo ? (
            <div className="flex items-center">
              <Link href={`/${cascadId}/writing/new-post`} target="_blank">
                <div
                  className={`px-4 cursor-pointer h-[40px] text-first border border-[rgba(212,201,253,0.7)] rounded-[20px] duration-300 bg-[#D4C9FD40] bg-opacity-25 hover:bg-[rgba(212,201,253,0.45)] shadow-[3px_3px_2px_0_rgba(212,201,253,0.7)] flex items-center justify-center hover:shadow-[2px_2px_2px_0_rgba(212,201,253,0.7)] ${
                    router.route.includes(`/writing/`)
                      ? '!bg-[rgba(133,120,180,1)] !shadow-[2px_2px_2px_0_rgba(212,201,253,0.7)] !text-white'
                      : ''
                  }`}
                >
                  START CREATING
                  <WritingIcon
                    className={`ml-3 ${
                      router.route.includes(`/writing/`)
                        ? 'text-white'
                        : 'text-first'
                    }`}
                  />
                </div>
              </Link>
              <User />
            </div>
          ) : (
            <div className="flex items-center">
              <Link href={`/login?cburl=${router.asPath}`}>
                <div
                  className={`w-[150px] h-[40px] btn rounded-[20px] bg-[#BAF9C140] bg-opacity-25`}
                >
                  LOG IN/SIGN UP
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

const CascadLayoutContext = ({ children }: { children: ReactNode }) => {
  return (
    <CascadInfoProvider>
      <CascadLayout>{children}</CascadLayout>
    </CascadInfoProvider>
  );
};

export default CascadLayoutContext;
