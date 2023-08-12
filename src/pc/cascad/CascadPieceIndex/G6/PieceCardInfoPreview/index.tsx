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

const PieceCardInfoView = (props: { cascadeId: string; pieceUuid: string }) => {
  const { cascadeId, pieceUuid } = props;

  // const [pieceCardInfo, setPieceCardInfo] = useState({});

  const { data: pieceCardInfo, isValidating } = usePieceCardInfoReq({
    cascadeId,
    pieceUuid,
  });
  console.log(pieceCardInfo);
  /** 页面滚动顶部 */
  useEffect(() => {}, [pieceUuid]);

  return (
    <div
      // className={`flex justify-center items-center  p-[15px_20px] w-[600px] h-[240px] rounded-[20px] border-[1px] border-border shadow-shadow-second  overflow-hidde`}
      className={`flex justify-center h-[600px] w-full overflow-hidde`}
    >
      <Spin spinning={isValidating} size="large">
        <div className="w-full h-full">
          {pieceCardInfo && (
            // <Link
            //   key={pieceCardInfo.id}
            //   href={`/cascad/${cascadeId}/${pieceCardInfo.uuid}`}
            //   style={{
            //     textDecoration: 'none',
            //   }}
            //   className="w-full h-full"
            // >
            <div className="flex justify-items-center flex-col w-[240px] relative h-full">
              <div className="p-[10px] px-0 font-semibold">Preview</div>
              <div
                className={
                  ' !w-[240px] !ml-0 p-[px] h-[240px] overflow-hidden !bg-[#434343]'
                }
              >
                {pieceCardInfo?.coverUrl && (
                  <img
                    src={pieceCardInfo.coverUrl}
                    alt=""
                    style={{
                      objectFit: 'fill',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                )}
              </div>
              <div className="w-[240px]">
                <div className="flex flex-col mt-4 gap-4">
                  <div className="flex relative items-center w-full leading-[18px] !text-frist text-[14px] h-[18px]">
                    By
                    <span
                      className="ml-1 cursor-pointer underline"
                      onClick={() => {
                        window.open(
                          `/cascad/${cascadeId}/usercenter?userId=${pieceCardInfo.createBy}`
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
                  <div className="h-[30]">
                    {pieceCardInfo?.tagInfos[0] && (
                      <Tag
                        tagList={pieceCardInfo.tagInfos}
                        spaceSize={16}
                        tagClassName="!px-3 !h-7"
                      />
                    )}
                  </div>
                  {/* 标题 内容 */}
                  <div className=" h-[220px] w-[240px]">
                    <div className="text-[22px] font-medium  line-clamp-2  break-words">
                      {pieceCardInfo?.title}
                    </div>

                    <div className="text-[16px] pt-[10px] leading-[23px] h-[100px]">
                      <div className="text-[#231F20] break-words  line-clamp-4  text-ellipsis">
                        {pieceCardInfo?.subTitle || '-'}
                      </div>
                    </div>
                  </div>
                  {/* 底部数字 */}
                  <div className="absolute bottom-[15px] flex">
                    <span className="flex items-center  text-[18px]">
                      <WaterIcon className="mr-[6px] w-[18px] h-[21px]" />
                      {floorFixedNumber(pieceCardInfo?.rewardAmount || 0, 0)}
                      <span className="text-[#5E5E5E] text-[14px] ml-1"></span>
                    </span>
                    <span className="mx-[10px]"> </span>
                    <span className="flex items-center  text-[18px]">
                      <LikedIcon
                        className={`text-[${
                          pieceCardInfo?.isLike ? '#FFCFCF' : '#833B3B'
                        }] mr-[6px] w-[22px] h-[20px]`}
                      />
                      {pieceCardInfo?.likeCount}
                      <span className="text-[#5E5E5E] text-[14px] ml-1"></span>
                    </span>
                    <span className="mx-[10px]"></span>
                    <span className="flex items-center text-[18px]">
                      <CommentIcon
                        className={`text-[#A56D19] mr-[6px]  w-[21px] h-[20px]`}
                      />
                      {pieceCardInfo?.commentCount}
                      <span className="text-[#5E5E5E] text-[14px] ml-1"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            // </Link>
          )}
        </div>
      </Spin>
    </div>
  );
};
export default PieceCardInfoView;
