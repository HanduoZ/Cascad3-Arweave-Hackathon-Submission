import { useEffect, useState } from 'react';
import usePieceCardInfoReq from 'src/data/use-cascade-piece-cardinfo';
import { formatTimestamp } from 'src/utils/common';

import Tag from 'src/components/Tag';
import { ReactComponent as WaterIcon } from 'src/assets/media/svg/icon-water.svg';
import { ReactComponent as LikedIcon } from 'src/assets/media/svg/icon-liked.svg';
import { ReactComponent as CommentIcon } from 'src/assets/media/svg/icon-comment.svg';
import { Spin } from 'antd';
import { floorFixedNumber } from 'src/utils/common';
import Link from 'next/link';
import { StarNode } from 'src/data/use-cascade-starsdata';

const PieceCardInfoView = (props: {
  cascadeId?: string;
  pieceUuid?: string;
  data?: StarNode;
}) => {
  const { cascadeId, pieceUuid, data: pieceCardInfo } = props;

  // const [pieceCardInfo, setPieceCardInfo] = useState({});

  // const { data: pieceCardInfo, isValidating } = usePieceCardInfoReq({
  //   cascadeId,
  //   pieceUuid,
  // });
  // console.log(pieceCardInfo);
  /** 页面滚动顶部 */
  // useEffect(() => {}, [pieceUuid]);

  return (
    <div
      // className={`flex justify-center items-center  p-[15px_20px] w-[600px] h-[240px] rounded-[20px] border-[1px] border-border shadow-shadow-second  overflow-hidde`}
      className={`relativ flex justify-center  items-center w-[580px]  pointer-events-auto h-[215px] rounded-[20px] border-[1px] border-border shadow-shadow-second  overflow-hidde`}
    >
      <Spin spinning={false} size="large">
        {pieceCardInfo && (
          <Link
            key={pieceCardInfo.id}
            href={`/${cascadeId}/${pieceCardInfo.uuid}`}
            style={{
              textDecoration: 'none',
            }}
            className="w-full"
          >
            <div className="flex flex-1 w-full h-full relative  justify-center items-center ">
              <div
                className={
                  ' !w-[185px]  h-[185px] overflow-hidden !bg-[#434343]'
                }
              >
                {pieceCardInfo?.coverUrl && (
                  <img
                    src={pieceCardInfo.coverUrl}
                    alt=""
                    style={{
                      objectFit: 'fill',
                      width: '100%',
                    }}
                  />
                )}
              </div>
              <div className="w-[340px)] h-[185px] ml-[15px] ">
                <div className="flex flex-col gap-2">
                  {/* by 作者  日期 */}
                  <div className="flex relative items-center w-full leading-[18px] !text-frist text-[14px] h-[18px]">
                    By
                    <span
                      className="ml-1 cursor-pointer underline"
                      onClick={() => {
                        window.open(
                          `/${cascadeId}/usercenter?userId=${pieceCardInfo.createBy}`
                        );
                      }}
                    >
                      {pieceCardInfo?.authorUsername}
                    </span>
                    <span className="mx-1">•</span>
                    {pieceCardInfo?.createTime && (
                      <div>
                        {formatTimestamp(
                          (pieceCardInfo.createTime as any) / 1000,
                          true
                        )}
                      </div>
                    )}
                    {/* <div className="absolute right-3">50%</div> */}
                  </div>
                  <div className="text-[25px] h-[34px] mr-4 font-medium w-[340px] line-clamp-1  text-ellipsis break-words">
                    {pieceCardInfo?.title}
                  </div>
                  <div className="h-[30]">
                    {pieceCardInfo?.tagInfos[0] && (
                      <Tag
                        tagList={pieceCardInfo.tagInfos}
                        spaceSize={16}
                        tagClassName="!px-3 !h-7"
                      />
                    )}
                  </div>
                  <div className="text-[16px] leading-[23px] h-[46px]">
                    <div className="line-clamp-2 text-[#231F20] break-words">
                      {pieceCardInfo?.subTitle || '-'}
                    </div>
                  </div>
                  <div className=" flex">
                    <span className="flex items-center">
                      <WaterIcon className="mr-[6px] w-[15px] h-[18px]" />
                      {floorFixedNumber(pieceCardInfo?.rewardAmount || 0, 0)}
                      <span className="text-[#5E5E5E] text-[14px] ml-1">
                        Stream
                      </span>
                    </span>
                    <span className="mx-[10px]">•</span>
                    <span className="flex items-center">
                      <LikedIcon
                        className={`text-[${
                          pieceCardInfo?.isLike ? '#FFCFCF' : '#833B3B'
                        }] mr-[6px] w-[18px] h-[16px]`}
                      />
                      {pieceCardInfo?.likeCount}
                      <span className="text-[#5E5E5E] text-[14px] ml-1">
                        Likes
                      </span>
                    </span>
                    <span className="mx-[10px]">•</span>
                    <span className="flex items-center">
                      <CommentIcon
                        className={`text-[#A56D19] mr-[6px]  w-[17px] h-[16px]`}
                      />
                      {pieceCardInfo?.commentCount}
                      <span className="text-[#5E5E5E] text-[14px] ml-1">
                        Comments
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}
      </Spin>
    </div>
  );
};
export default PieceCardInfoView;
