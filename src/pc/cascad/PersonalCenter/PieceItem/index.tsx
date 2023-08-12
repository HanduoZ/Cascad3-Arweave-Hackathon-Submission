import Link from 'next/link';
import Tag from 'src/components/Tag';
import type { PieceInUserProfileInfo } from 'src/data/use-cascade-user-piece-list';
import { formatTimestamp } from 'src/utils/common';
import styles from './index.module.less';
import useRouterParams from 'src/hooks/use-router-params';
import clsx from 'clsx';
import { useState } from 'react';
import { updateArIdReq } from 'src/api/cascad/piece';
import { message } from 'antd';
import { ReactComponent as WaterIcon } from 'src/assets/media/svg/icon-water.svg';
import { ReactComponent as LikedIcon } from 'src/assets/media/svg/icon-liked.svg';

interface PieceProps {
  data: PieceInUserProfileInfo;
  upperSuccessCallBack: (id: number) => void;
  currState?: string;
}

const PieceItem = (props: PieceProps) => {
  const { data, currState, upperSuccessCallBack } = props;

  const { cascadId } = useRouterParams();

  const [loading, setLoading] = useState(false);

  /** 上链 */
  const updatePieceArId = async (id: number) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await updateArIdReq(id, cascadId);
      if (res.data.data) {
        message.success('Success!');
        upperSuccessCallBack(id);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      href={
        data.currState === 0 || data.currState === 20
          ? `/${cascadId}/writing/${data.uuid}`
          : `/${cascadId}/${data.uuid}`
      }
      target="_blank"
      className="w-full"
    >
      <div
        key={data.id}
        className="border border-border relative text-first rounded-[20px] p-[30px] h-[292px] flex mb-[30px]"
      >
        <div
          className="button-grey-noshadow absolute px-5 flex items-center right-[30px] h-[33px] top-6"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (window) window.open(`/${cascadId}/writing/${data.uuid}`);
          }}
        >
          EDIT
        </div>
        {currState === '10' && !data.isOnChain && (
          <div
            className={clsx(
              'absolute right-[120px] top-6 duration-300 overflow-hidden min-w-[122px] px-4 border border-border rounded-[20px] h-[33px] flex items-center justify-center'
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              updatePieceArId(data.id);
            }}
          >
            <div className="flex items-center">
              {loading && (
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
              )}
              Put On-Chain
            </div>
          </div>
        )}
        <div className="w-[231px] relative overflow-hidden">
          {data.coverUrl && (
            <img
              src={data.coverUrl}
              alt=""
              className="h-full absolute left-[50%] top-0"
              style={{
                transform: 'translateX(-50%)',
              }}
            />
          )}
        </div>
        <div className="flex-1 ml-8">
          <div className="flex flex-wrap w-[240px] leading-[18px]">
            <span>By</span>
            <span
              className="ml-1 cursor-pointer underline"
              onClick={() =>
                window.open(`/${cascadId}/usercenter?userId=${data.createBy}`)
              }
            >
              {data.authorUsername}
            </span>
            <span className="mx-1">•</span>
            <div>{formatTimestamp(data.createTime / 1000, true)}</div>
          </div>
          <div
            className={clsx(
              'mt-[10px] text-[25px] font-medium',
              styles.ellipsis
            )}
          >
            {data.title}
          </div>
          <div className="mt-[10px]">
            <Tag
              tagList={data.tagInfos}
              spaceSize={16}
              tagClassName="!px-3 !h-7"
            />
          </div>
          <div className={clsx('mt-[10px]', styles.ellipsis)}>
            {data.subTitle}
          </div>
          <div className="flex mt-[10px]">
            <span className="flex items-center">
              <WaterIcon className="mr-[6px]" />
              {data.rewardAmount}
              <span className="text-[#5E5E5E] text-[14px] ml-1">Stream</span>
            </span>
            <span className="mx-[10px]">•</span>
            <span className="flex items-center">
              <LikedIcon className="text-[#833B3B] mr-[6px]" />
              {data.likeCount}
              <span className="text-[#5E5E5E] text-[14px] ml-1">Likes</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default PieceItem;
