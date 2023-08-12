import { message } from 'antd';
import { ReactComponent as GroupIcon } from 'src/assets/media/svg/icon-group.svg';
import { ReactComponent as CoinIcon } from 'src/assets/media/svg/icon-coin.svg';
import { ReactComponent as WaterIcon } from 'src/assets/media/svg/icon-water.svg';
import { ReactComponent as Web3Icon } from 'src/assets/media/svg/icon-web3verified.svg';

import useUserInfo from 'src/hooks/use-user-info';

import { useCallback, useState } from 'react';
import { followReq } from 'src/api/cascad';

import Link from 'next/link';
import { useRouter } from 'next/router';

import type { CascadeInfo } from 'src/data/use-cascade-list';

import { floorFixedNumber } from 'src/utils/common';

interface CascadeItemProps {
  item: CascadeInfo;
}

const CascadeItem = (props: CascadeItemProps) => {
  const { item } = props;
  // const { cascadId } = useRouterParams();
  const [loading, setLoading] = useState(false);
  const { data: userInfo } = useUserInfo();
  const router = useRouter();

  /** 保存 */
  /** 关注、取消关注 1: 关注 2：取消关注 */
  const followOrUnFollow = useCallback(
    async (type: number) => {
      if (!userInfo) {
        router.push(`/login?cburl=${encodeURIComponent(router.asPath)}`);
        return;
      }

      try {
        setLoading(true);
        let res;
        // if (type === 1) {
        res = await followReq(item.id);
        // } else {
        //   res = await unFollowReq(item.id);
        // }
        if (res.data.data) {
          item.role = 20;
          message.success('Success!!!');
          // cascaMutate({ ...cascadDetail, role: type === 1 ? 20 : -1 });
          // mutate('/client/user/cascade/list');
        }
      } catch (error) {
        message.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [item, router, userInfo]
  );

  return (
    <Link
      href={`/${item.cascadeId}`}
      // href={`/testtmp/test`}
      key={item.id}
      prefetch={false}
      target="_blank"
    >
      {/* h-[469px]   489 移除 tax rate*/}
      <div className="rounded-[20px] relative text-first cursor-pointer overflow-y-auto border border-border-second  hover:shadow-hover h-[469px] w-[328px] overflow-hidden z-1">
        <div className="absolute left-0 top-0 h-[180px]  w-full  bg-[#434343] z-10">
          <div className="object-fill w-100 h-100 ">
            {item.coverUrl && (
              <img
                src={item.coverUrl}
                alt=""
                style={{
                  objectFit: 'fill',
                  width: '100%',
                }}
              />
            )}
          </div>
        </div>

        <div className="absolute flex left-0 top-[calc(180px-40px)]  w-full bottom-0 z-20 flex-col justify-start items-center">
          <div className="relative">
            <div
              className={`!w-[80px] p-[px] h-[80px]  rounded-[50%] overflow-hidden !bg-[#D9D9D9] ${
                item.isWeb3 ? 'web3' : ''
              }`}
            >
              {item.logoUrl && (
                <img
                  src={item.logoUrl}
                  alt=""
                  style={{
                    objectFit: 'fill',
                    width: '100%',
                  }}
                />
              )}
            </div>
            {item.isWeb3 && (
              <div className="absolute right-[-5px] bottom-[-2px] w-[30px] h-[30px]">
                <Web3Icon style={{ width: '30px', height: '30px' }} />
              </div>
            )}
          </div>
          <div className="flex mt-2 items-center  w-[calc(100%-30px)]">
            <span className="text-[25px] line-clamp-1 text-center  m-auto break-words  font-medium text-first leading-[34px]">
              {item.name}
            </span>
          </div>
          {false && (
            <div className="flex items-center ml-2 mt-2 text-[#5E5E5E]  tracking-[0.28px]">
              <div className="rounded-full w-4 h-4 flex items-center justify-center mr-1">
                <CoinIcon style={{ width: '14px', height: '14px' }} />
              </div>
              <div className="text-[#5E5E5E]">Tax rate</div>
              <span className=" ml-2  text-first">
                {Math.round(item.taxRatio * 10000) / 100}%
              </span>
            </div>
          )}
          <div className="flex items-center ml-2 mt-2 text-[#5E5E5E] text-[14px] font-normal tracking-[0.28px] leading-[130%]">
            <div className="w-4 h-4 flex items-center justify-center mr-1">
              <WaterIcon style={{ width: '15px', height: '17px' }} />
            </div>
            <span className="text-first ml-1">
              {floorFixedNumber(item.totalStream || 0, 0)}
            </span>
            <div className="text-[#5E5E5E] ml-1">Stream</div>

            <div className="text-first mx-2">•</div>

            <div className="rounded-full w-4 h-4 flex items-center justify-center mr-1">
              <GroupIcon style={{ width: '18px', height: '16px' }} />
            </div>
            <span className="text-first  ml-1">{item.memberCount}</span>
            <div className="text-[#5E5E5E] ml-1">Members</div>
          </div>
          <div className="flex mt-[10px] w-[calc(100%-30px)]  text-[16px] text-center  leading-[23px] item-center">
            <div className="line-clamp-3 text-first  m-auto break-words">
              {item.description || '-'}
            </div>
          </div>
          <div className="absolute bottom-5">
            {(item.role === -1 || !userInfo) && (
              <div
                className={`button-yellow !h-[48px] !rounded-[24px]`}
                onClick={(e) => {
                  // e.stopPropagation();
                  //
                  e.preventDefault();
                  followOrUnFollow(1);
                }}
              >
                {loading && (
                  <span className="mr-2">
                    <i className="fa fa-circle-o-notch fa-spin " />
                  </span>
                )}
                &nbsp;Join&nbsp;
              </div>
            )}
            {(item.role === 10 || item.role === 20) && userInfo && (
              <div
                className={` select-none  px-[40px] h-[48px] text-first border border-[rgba(249,242,186,1)] rounded-[24px] text-opacity-25 bg-[rgba(249,242,186,0.25)] shadow-[2px_2px_2px_0_rgba(240,231,6,0.2)] flex items-center`}
              >
                Joined
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
export default CascadeItem;
