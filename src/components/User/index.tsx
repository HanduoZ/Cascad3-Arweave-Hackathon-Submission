import { Avatar, Popover } from 'antd';
import { ReactComponent as AlertIcon } from 'src/assets/media/svg/icon-alert.svg';
import MessageList from './MessageList';
import useUnreadMsgCountReq from 'src/data/use-un-read-msg-count';
import UserInfo from './UserInfo';
import useUserInfo from 'src/data/use-user-info';
import { UserOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const User = () => {
  /** hook */
  const { data: userInfo } = useUserInfo();

  /** 接口-未读消息数量 */
  const { data: unreadMsgCount } = useUnreadMsgCountReq();
  return (
    <>
      <Popover
        placement="bottom"
        content={<MessageList unreadMsgCount={unreadMsgCount} />}
        showArrow={false}
        overlayClassName={styles.popover}
      >
        <div className="ml-5 relative flex items-center cursor-pointer">
          <AlertIcon />
          {!!unreadMsgCount && (
            <div className="bg-[#833B3B] w-[18px] h-[18px] rounded-full border-[3px] absolute -right-[2px] -top-[6px] border-[#fff]"></div>
          )}
        </div>
      </Popover>
      <Popover
        placement="bottomLeft"
        content={<UserInfo />}
        showArrow={false}
        overlayClassName={styles.popover}
      >
        {userInfo?.faceUrl ? (
          <Avatar
            size={40}
            className="cursor-pointer !ml-5"
            src={userInfo?.faceUrl}
            icon={<UserOutlined />}
          />
        ) : (
          <Avatar
            size={40}
            className="cursor-pointer !ml-5"
            icon={<UserOutlined />}
          />
        )}
      </Popover>
    </>
  );
};
export default User;
