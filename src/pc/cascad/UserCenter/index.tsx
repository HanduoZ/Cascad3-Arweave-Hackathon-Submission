import { Avatar, Tooltip } from 'antd';
import { ReactComponent as WaterIcon } from 'src/assets/media/svg/icon-water.svg';
import Tag from 'src/components/Tag';
import useRouterParams from 'src/hooks/use-router-params';
import { floorFixedNumber, formatTimestamp } from 'src/utils/common';
import { DEFAULT_PAGE_SIZE } from 'src/utils/statics';
import styles from './index.module.less';
import { UserOutlined } from '@ant-design/icons';
import useOtherUserPieceReq from 'src/data/use-other-user-info';
import type { PieceInUserProfileInfo } from 'src/data/use-other-user-info';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ReactComponent as LikedIcon } from 'src/assets/media/svg/icon-liked.svg';
import clsx from 'clsx';
import useCascadeUserInfoReq from 'src/data/use-cascade-user-info';

const UserCenter = () => {
  const { cascadId } = useRouterParams();
  const router = useRouter();
  const userId = router.query.userId as string;

  /** 接口-个人详情 */
  const { data: userInfo } = useCascadeUserInfoReq({
    userId,
    cascadeId: cascadId,
  });

  /** 接口-个人中心 */
  const { data, size, total, setSize, isValidating, isLoading } =
    useOtherUserPieceReq({
      cascadeId: cascadId,
      userId,
      pageSize: DEFAULT_PAGE_SIZE,
    });

  /** 下游数据 */
  const pieceData = data
    ? ([] as PieceInUserProfileInfo[]).concat(...data)
    : [];

  /** 是否还有更多 */
  const isMore = !isValidating && pieceData.length < total;
  return (
    <div className="pt-[42px] h-full overflow-y-auto">
      <div className="w-[780px] m-[0_auto] flex flex-col items-center text-first">
        <Avatar
          size={110}
          src={userInfo && `${userInfo?.faceUrl}`}
          icon={<UserOutlined />}
        />
        <h2 className="mt-3 leading-[46px]">{userInfo?.username}</h2>
        <div className="flex items-center">
          <span>Total-stream:</span>
          <WaterIcon className="ml-[10px] mr-1" />
          <Tooltip
            title={
              <div>
                <div className="flex items-center">
                  <span className="mr-1">In-stream:</span>
                  {floorFixedNumber(userInfo?.inStream || 0, 0)}
                </div>
                <div className="flex items-center">
                  <span className="mr-1">Out-stream:</span>
                  {floorFixedNumber(userInfo?.outStream || 0, 0)}
                </div>
              </div>
            }
          >
            <span className="text-[18px] cursor-pointer font-semibold">
              {floorFixedNumber(userInfo?.inStream || 0, 0) +
                floorFixedNumber(userInfo?.outStream || 0, 0)}
            </span>
          </Tooltip>
        </div>
        <div className="flex items-center mt-3">
          <span>Posts: </span>
          <span className="underline">{total}</span>
        </div>
        <div className="w-full mt-[18px] font-medium">Posts</div>
        <div className="mt-6 w-full">
          {isLoading && (
            <div className="flex items-center h-[200px] justify-center">
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
              loading
            </div>
          )}
          {!isLoading && data && pieceData.length === 0 && (
            <div className="flex items-center h-[200px] justify-center">
              No piece currently available
            </div>
          )}
          {pieceData.map((item) => (
            <Link
              key={item.id}
              href={`/${cascadId}/${item.uuid}`}
              style={{
                textDecoration: 'none',
              }}
              className="w-full"
            >
              <div
                key={item.id}
                className="border border-border text-first rounded-[20px] p-[30px] h-[292px] flex mb-[30px]"
              >
                <div className="w-[231px] relative overflow-hidden">
                  {item.coverUrl && (
                    <img
                      src={item.coverUrl}
                      alt=""
                      className="h-full absolute left-[50%] top-0"
                      style={{
                        transform: 'translateX(-50%)',
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 ml-8">
                  <div className="flex items-center leading-[18px]">
                    By
                    <span
                      className="ml-1 cursor-pointer underline"
                      onClick={() =>
                        window.open(
                          `/${cascadId}/usercenter?userId=${item.createBy}`
                        )
                      }
                    >
                      {item.authorUsername}
                    </span>
                    <span className="mx-1">•</span>
                    <div>{formatTimestamp(item.createTime / 1000, true)}</div>
                  </div>

                  <div
                    className={clsx(
                      'mt-[10px] text-[25px] font-medium',
                      styles.ellipsis
                    )}
                  >
                    {item.title}
                  </div>
                  <div className="mt-[10px]">
                    <Tag
                      tagList={item.tagInfos}
                      spaceSize={16}
                      tagClassName="!px-3 !h-7"
                    />
                  </div>
                  <div className={clsx('mt-[10px]', styles.ellipsis)}>
                    {item.subTitle}
                  </div>
                  <div className="flex mt-[10px]">
                    <span className="flex items-center">
                      <WaterIcon className="mr-[6px]" />
                      {item.rewardAmount}
                      <span className="text-[#5E5E5E] text-[14px] ml-1">
                        Stream
                      </span>
                    </span>
                    <span className="mx-[10px]">•</span>
                    <span className="flex items-center">
                      <LikedIcon
                        className={`text-[${
                          item.isLike ? '#FFCFCF' : '#833B3B'
                        }] mr-[6px]`}
                      />
                      {item.likeCount}
                      <span className="text-[#5E5E5E] text-[14px] ml-1">
                        Likes
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {pieceData.length > 0 && (
            <div className="h-8 flex items-center justify-center text-first mb-6">
              {isMore && (
                <div
                  className="cursor-pointer"
                  onClick={() => setSize(size + 1)}
                >
                  Load more
                </div>
              )}
              {isValidating && (
                <div>
                  <span className="mr-2">
                    <i className="fa fa-circle-o-notch fa-spin " />
                  </span>
                  loading
                </div>
              )}
              {pieceData.length >= total && (
                <div>Reaching the Edge of the Posts</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
