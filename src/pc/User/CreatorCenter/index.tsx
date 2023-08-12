import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import useUserInfoReq from 'src/data/use-user-info';
import { ReactComponent as WaterIcon } from 'src/assets/media/svg/icon-water.svg';
import { ReactComponent as PostArrowIcon } from 'src/assets/media/svg/icon-post-arrow.svg';
import { floorFixedNumber } from 'src/utils/common';

const CreatorCenter = () => {
  /** 接口-用户信息 */
  const { data: userInfo, isValidating } = useUserInfoReq();
  return isValidating ? (
    <div className="flex h-[140px] items-center justify-center">
      <span className="mr-2">
        <i className="fa fa-circle-o-notch fa-spin " />
      </span>
      loading
    </div>
  ) : (
    <div className="text-first">
      <div className="flex">
        <Avatar size={100} src={userInfo?.faceUrl} icon={<UserOutlined />} />
        <div className="ml-10 w-[402px]">
          <div className="font-semibold text-[38px] text-first leading-[45px]">
            {userInfo?.username}
          </div>
          <div className="flex items-center mt-5">
            <span>Current Balance</span>
            <WaterIcon className="ml-6" />
            <span className="ml-[6px]">
              {floorFixedNumber(userInfo?.tokenAmount || 0, 0)}
            </span>
          </div>
          {false && (
            <div className="mt-[18px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. lacus, ut
              interdum tellus elit sed risus maecenas.
            </div>
          )}

          <div className="w-[402px] mt-8 h-[240px] rounded-[10px] bg-zinc-100 shadow flex flex-col">
            <div className="w-[402px] h-[72px] bg-[rgba(217,217,217,1)] flex items-center pl-[35px] rounded-tl-[10px] rounded-tr-[10px] border  border-[rgba(136,136,136,1)]">
              <span className="text-[25px] font-semibold">Total Stream</span>
              <span className="ml-[88px] flex items-center">
                <WaterIcon className="mr-1" />
                <span className="text-[25px] font-semibold">
                  {floorFixedNumber(userInfo?.inStream || 0, 0) +
                    floorFixedNumber(userInfo?.outStream || 0, 0)}
                </span>
              </span>
            </div>
            <div className="border pt-7 pl-7 pr-6 border-border-second bg-[rgba(243,243,243,1)] flex-1 rounded-bl-[10px] rounded-br-[10px] border-t-none">
              <div className="border h-[50px] flex items-center border-[rgba(136,136,136,1)] rounded-[10px] pl-4">
                <span className="text-[20px]">In-stream</span>
                <span className="ml-[140px] flex items-center">
                  <WaterIcon className="mr-1" />
                  <span className="text-[20px]">
                    {floorFixedNumber(userInfo?.inStream || 0, 0)}
                  </span>
                </span>
              </div>
              <div className="border mt-[14px] h-[50px] flex items-center border-[rgba(136,136,136,1)] rounded-[10px] pl-4">
                <span className="text-[20px]">Out-stream</span>
                <span className="ml-[124px] flex items-center">
                  <WaterIcon className="mr-1" />
                  <span className="text-[20px]">
                    {floorFixedNumber(userInfo?.outStream || 0, 0)}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {userInfo?.dailyStreamArId && (
            <div className="w-full text-left mt-8 bg-[#888] bg-opacity-5 text-[14px]  h-[105px] border-border rounded-[20px] border-[1px]">
              <div className="border-b-[1px] border-border h-10 flex items-center pl-[30px]">
                This data has been permanently stored on-chain.
              </div>
              <div className="mt-[10px] flex items-center pl-[30px]">
                ARWEAVE TRANSACTION
                <PostArrowIcon className="ml-2" />
              </div>
              <div className="pl-[30px] mt-1">
                <a
                  href={`https://arseed.web3infra.dev/${userInfo.dailyStreamArId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {userInfo?.dailyStreamArId}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CreatorCenter;
