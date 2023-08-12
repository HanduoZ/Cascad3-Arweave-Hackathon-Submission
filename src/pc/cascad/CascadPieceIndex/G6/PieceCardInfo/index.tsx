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
import { colorConvert } from 'src/utils/common';

const PieceCardInfoView = (props: { cascadeId: string; pieceUuid: string }) => {
  const { cascadeId, pieceUuid } = props;

  // const [pieceCardInfo, setPieceCardInfo] = useState({});

  const { data: pieceCardInfo, isLoading } = usePieceCardInfoReq({
    cascadeId,
    pieceUuid,
  });
  console.log(pieceCardInfo);
  useEffect(() => {}, [pieceUuid]);

  return (
    <div
      // className={`flex justify-center items-center  p-[15px_20px] w-[600px] h-[240px] rounded-[20px] border-[1px] border-border shadow-shadow-second  overflow-hidde`}
      className={`flex relative justify-center h-[280px] w-[226px] overflow-hidde`}
    >
      <Spin spinning={isLoading} size="large">
        <div className="w-full h-full">
          {pieceCardInfo && (
            <Link
              key={pieceCardInfo.id}
              href={`/${cascadeId}/${pieceCardInfo.uuid}`}
              style={{
                textDecoration: 'none',
              }}
              className="w-full h-full"
            >
              <div className="flex justify-items-center flex-col  w-[226px] relative h-full  overflow-hidde">
                {/* <div className="p-[10px] px-0 font-semibold">Preview</div> */}
                <div
                  className={
                    'relative !w-100  h-[120px] overflow-hidden !bg-[#434343]'
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
                {/* Tag */}
                <div className="absolute right-[6px] top-[8px] ">
                  {pieceCardInfo?.tagInfos[0] && (
                    <div
                      className="flex items-center  !h-[24px] bg-[white] border rounded-[16px]  overflow-hidden  text-[14px]"
                      style={{
                        borderColor: pieceCardInfo?.tagInfos[0].tagColor,
                      }}
                    >
                      <div
                        style={{
                          color: pieceCardInfo?.tagInfos[0].tagColor,
                          background: colorConvert(
                            pieceCardInfo?.tagInfos[0].tagColor,
                            0.2
                          ),
                        }}
                      >
                        <span className={` px-2 `}>
                          {pieceCardInfo?.tagInfos[0].tag}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="h-[160px] px-[12px] w-full">
                  <div className="flex flex-col mt-2 gap-2">
                    <div className="flex relative items-center w-full leading-[18px] !text-frist text-[14px] h-[18px]">
                      By
                      <span
                        className="ml-1 cursor-pointer max-w-[100px] line-clamp-1 underline"
                        onClick={(e) => {
                          window.open(
                            `/${cascadeId}/usercenter?userId=${pieceCardInfo.createBy}`
                          );
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        {pieceCardInfo?.authorUsername}
                      </span>
                      <span className="mx-1">•</span>
                      {pieceCardInfo?.createTime && (
                        <div className="line-clamp-1">
                          {formatTimestamp(
                            (pieceCardInfo.createTime as any) / 1000,
                            true
                          )}
                        </div>
                      )}
                      {/* <div className="absolute right-3">50%</div> */}
                    </div>

                    {/* 标题 内容 */}
                    <div className=" h-[100px] w-[100%]">
                      <div className="text-[16px] font-medium text-frist line-clamp-2 leading-5 break-words  text-ellipsis">
                        {pieceCardInfo?.title}
                      </div>

                      <div className="text-[#231F20] mt-[6px] break-words line-clamp-2 leading-5  text-ellipsis text-[14px] ">
                        {pieceCardInfo?.subTitle || '-'}
                      </div>
                    </div>
                    {/* 底部数字 */}
                    <div className="absolute bottom-[10px]  text-[13px] flex">
                      <span className="flex items-center ">
                        <WaterIcon className="mr-[6px] w-[13px] h-[14px]" />
                        {floorFixedNumber(pieceCardInfo?.rewardAmount || 0, 0)}
                        <span className="text-[#5E5E5E] ml-1"></span>
                      </span>
                      <span className="mx-[10px]">•</span>
                      <span className="flex items-center ">
                        <LikedIcon
                          className={`text-[${
                            pieceCardInfo?.isLike ? '#FFCFCF' : '#833B3B'
                          }] mr-[6px] w-[13px] h-[12px]`}
                        />
                        {pieceCardInfo?.likeCount}
                        <span className="text-[#5E5E5E]   ml-1"></span>
                      </span>
                      <span className="mx-[10px]">•</span>
                      <span className="flex items-center ">
                        <CommentIcon
                          className={`text-[#A56D19] mr-[6px]  w-[13px] h-[13px]`}
                        />
                        {pieceCardInfo?.commentCount}
                        <span className="text-[#5E5E5E] ml-1"></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </Spin>
    </div>
  );
};
export default PieceCardInfoView;
