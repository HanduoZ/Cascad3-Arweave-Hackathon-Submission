import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { memo } from 'react';
import useUserInfo from 'src/hooks/use-user-info';
import { ReactComponent as SmallWaterIcon } from 'src/assets/media/svg/icon-small-water.svg';
import { ReactComponent as MineStreamIcon } from 'src/assets/media/svg/icon-mine-stream.svg';
import { ReactComponent as MenuSettingIcon } from 'src/assets/media/svg/icon-menu-setting.svg';
import { floorFixedNumber } from 'src/utils/common';
import Link from 'next/link';
import useRouterParams from 'src/hooks/use-router-params';
import { TOKEN } from 'src/utils/statics';
import { useRouter } from 'next/router';
import Cascade from './Cascade';

const UserInfo = () => {
  const router = useRouter();
  const { cascadId } = useRouterParams();

  /** hook */
  const { data: userInfo, mutate: mutateUserInfo } = useUserInfo();

  /** log out */
  const singout = () => {
    localStorage.removeItem(TOKEN);
    mutateUserInfo();
    router.push('/');
  };
  return (
    <div className="rounded-[10px] w-[240px] text-first">
      <div className="h-[76px] border-b-[1px] border-border flex items-center pl-5">
        <Avatar
          size={40}
          className="cursor-pointer"
          src={userInfo?.faceUrl}
          icon={<UserOutlined />}
        />
        <div className="ml-[15px]">
          <div className="leading-5">{userInfo?.username}</div>
          <div className="flex items-center mt-1">
            <SmallWaterIcon className="relative top-[2px]" />
            <span className="ml-1 text-[14px] leading-[18px]">
              {floorFixedNumber(userInfo?.tokenAmount || 0, 0)}
            </span>
          </div>
        </div>
      </div>
      {cascadId && <Cascade />}
      <div className="border-b-[1px] border-border">
        <div className="pt-[15px] h-[43px] pl-5 text-[14px] text-[rgba(94,94,94,1)]">
          Your account
        </div>
        <div className="p-1 text-first">
          <Link href={`/user?type=0`}>
            <div className="h-10 flex items-center pl-4 rounded-[10px] cursor-pointer hover:bg-[rgba(209,209,209,0.4)] duration-300">
              <div className="w-6 flex items-center">
                <MenuSettingIcon />
              </div>
              Personal Setting
            </div>
          </Link>
        </div>
        <div className="p-1 text-first">
          <Link href={`/user?type=2`}>
            <div className="h-10 rounded-[10px] flex items-center pl-4 cursor-pointer hover:bg-[rgba(209,209,209,0.4)] duration-300">
              <div className="w-6 flex items-center">
                <MineStreamIcon />
              </div>
              My Stream
            </div>
          </Link>
        </div>
      </div>
      <div className="p-1 text-first">
        <div
          className="h-10 rounded-[10px] flex items-center pl-4 cursor-pointer hover:bg-[rgba(209,209,209,0.4)] duration-300"
          onClick={singout}
        >
          Log Out
        </div>
      </div>
    </div>
  );
};
export default memo(UserInfo);
