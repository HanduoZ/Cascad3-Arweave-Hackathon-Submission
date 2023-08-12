import Link from 'next/link';
import { ReactNode } from 'react';
import useUserInfo from 'src/hooks/use-user-info';
import { ReactComponent as WritingIcon } from 'src/assets/media/svg/icon-writing.svg';
import { ReactComponent as AlertIcon } from 'src/assets/media/svg/icon-alert.svg';
import { useRouter } from 'next/router';
import useRouterParams from 'src/hooks/use-router-params';
import { Avatar, Popover } from 'antd';
import CascadInfoProvider from './CascadInfoProvider';
import CascadeInfo from './CascadeInfo';
import useUnreadMsgCountReq from 'src/data/use-un-read-msg-count';
import MessageList from './MessageList';
import styles from './index.module.less';
import { UserOutlined } from '@ant-design/icons';
import UserInfo from '../UserInfo';

const CascadLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { cascadId } = useRouterParams();

  /** hook */
  const { data: userInfo } = useUserInfo();

  /** 接口-未读消息数量 */
  const { data: unreadMsgCount } = useUnreadMsgCountReq();

  return (
    <div className="h-full flex-1 flex flex-col overflow-hidden">
      <div
        className={`${
          userInfo ? 'pl-[116px]' : 'pl-8'
        } pr-[54px] h-[80px] flex items-center justify-between`}
      >
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
              <Popover
                placement="bottom"
                content={<MessageList unreadMsgCount={unreadMsgCount} />}
                showArrow={false}
                overlayClassName={styles.popover}
              >
                <div className="ml-5 relative flex items-center cursor-pointer">
                  <AlertIcon />
                  {!!unreadMsgCount && (
                    <div className="bg-[#833B3B] w-[18px] h-[18px] rounded-full border-[3px] absolute -right-[4px] -top-[6px] border-[#fff]"></div>
                  )}
                </div>
              </Popover>
              <Popover
                placement="bottomLeft"
                content={<UserInfo />}
                showArrow={false}
                overlayClassName={styles.popover}
              >
                <Avatar
                  size={40}
                  className="cursor-pointer !ml-5"
                  src={userInfo?.faceUrl}
                  icon={<UserOutlined />}
                />
              </Popover>
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/login">
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
