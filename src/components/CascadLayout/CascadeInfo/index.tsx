import { useRouter } from 'next/router';
import useCascadInfo from 'src/hooks/use-cascad-info';
import useRouterParams from 'src/hooks/use-router-params';
import { ReactComponent as Web3Icon } from 'src/assets/media/svg/icon-web3verified.svg';
import { ReactComponent as WaterIcon } from 'src/assets/media/svg/icon-water.svg';
import { floorFixedNumber } from 'src/utils/common';
import useUserInfo from 'src/hooks/use-user-info';
import { memo, useCallback, useState } from 'react';
import { followReq, unFollowReq } from 'src/api/cascad';
import { message } from 'antd';
import { mutate } from 'swr';

const CascadeInfo = () => {
  const router = useRouter();
  const { cascadId } = useRouterParams();

  const [loading, setLoading] = useState(false);

  /** hook */
  const { data: userInfo } = useUserInfo();

  /** hook-空间详情 */
  const { cascadDetail, cascaMutate } = useCascadInfo();

  /** 关注、取消关注 1: 关注 2：取消关注 */
  const followOrUnFollow = useCallback(
    async (type: number) => {
      try {
        if (loading || !cascadDetail?.id) return;
        setLoading(true);
        let res;
        if (type === 1) {
          res = await followReq(cascadDetail.id);
        } else {
          res = await unFollowReq(cascadDetail.id);
        }
        if (res.data.data) {
          message.success('Success!!!');
          cascaMutate({ ...cascadDetail, role: type === 1 ? 20 : -1 });
          mutate('/client/user/cascade/list');
        }
      } catch (error) {
        message.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [cascaMutate, cascadDetail, loading]
  );
  return (
    <div
      className="flex h-full flex-1 pr-8 items-center cursor-pointer"
      onClick={() => router.push(`/${cascadId}`)}
    >
      <div className="relative">
        <div
          className={`!w-[45px] p-[px] h-[45px]  rounded-[50%] overflow-hidden !bg-[#D9D9D9] ${
            cascadDetail?.isWeb3 ? 'web3' : ''
          }`}
        >
          {cascadDetail?.logoUrl && (
            <img
              src={cascadDetail?.logoUrl}
              alt=""
              style={{
                objectFit: 'fill',
                width: '100%',
              }}
            />
          )}
        </div>
        {cascadDetail?.isWeb3 && (
          <div className="absolute right-[-5px] bottom-[0px] w-[18px] h-[18px]">
            <Web3Icon style={{ width: '100%', height: '100%' }} />
          </div>
        )}
      </div>
      <span className="ml-5 text-first max-w-[300px] truncate  text-[25px]">
        {cascadDetail?.name || '-'}
      </span>

      <div className="w-0 h-[33px] mx-[15px] origin-top-left rotate-90 border border-first" />
      <div className="text-first text-[14px] font-normal leading-tight">
        Tax Rate: {(cascadDetail?.taxRatio || 0) * 100}%
        <br />
        <div className="flex items-center">
          Total Stream:
          <span className="flex items-center">
            <WaterIcon className="mx-1" />
            {floorFixedNumber(cascadDetail?.totalStream || 0, 0)}
          </span>
        </div>
      </div>
      {cascadDetail &&
        cascadDetail?.role !== 0 &&
        userInfo &&
        (cascadDetail?.role === -1 ? (
          <div
            className={`ml-5 !w-[90px] button-yellow !h-[39px] !rounded-[20px] justify-center flex items-center  !shadow-[2px_2px_2px_0_rgba(240,231,6,1)]`}
            onClick={(e) => {
              e.stopPropagation();
              followOrUnFollow(1);
            }}
          >
            {loading && (
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
            )}
            Join
          </div>
        ) : (
          <div
            // className={`px-4 ml-5 !h-[39px] text-first border border-[rgba(249,242,186,1)] rounded-[20px] text-opacity-25 bg-[rgba(249,242,186,0.25)] shadow-[2px_2px_2px_0_rgba(240,231,6,0.2)] flex items-center`}
            className={` select-none ml-5 w-[90px] p h-[39px] text-first border border-[rgba(249,242,186,1)] rounded-[20px] text-opacity-25 bg-[rgba(249,242,186,0.25)] shadow-[2px_2px_2px_0_rgba(240,231,6,0.2)] justify-center flex items-center`}
          >
            Joined
          </div>
        ))}
    </div>
  );
};
export default memo(CascadeInfo);
