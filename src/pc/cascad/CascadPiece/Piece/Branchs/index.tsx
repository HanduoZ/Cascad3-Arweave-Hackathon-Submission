import { formatTimestamp } from 'src/utils/common';
import usePieceDownStreamReq from 'src/data/use-piece-down-stream';
import type { PieceStreamInfo } from 'src/data/use-piece-down-stream';
import { DEFAULT_PAGE_SIZE } from 'src/utils/statics';
import useRouterParams from 'src/hooks/use-router-params';
import type { PieceDetailData } from 'src/data/use-piece-detail';
import Tag from 'src/components/Tag';
import Link from 'next/link';
import { ReactComponent as WaterIcon } from 'src/assets/media/svg/icon-water.svg';
import { ReactComponent as LikedIcon } from 'src/assets/media/svg/icon-liked.svg';
import clsx from 'clsx';
import styles from '../index.module.less';

interface BranchsProps {
  pieceDetail?: PieceDetailData;
}

const Branchs = (props: BranchsProps) => {
  const { cascadId } = useRouterParams();
  const { pieceDetail } = props;

  /** 接口-文章下游游 */
  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = usePieceDownStreamReq({
    pieceUuid: pieceDetail?.uuid,
    cascadeId: cascadId,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  /** 下游数据 */
  const downStream = data ? ([] as PieceStreamInfo[]).concat(...data) : [];

  /** 是否还有更多 */
  const isMore =
    !isValidating &&
    downStream.length > 0 &&
    downStream.length < (pieceDetail?.downstreamCount || 0);
  return (
    <>
      <div
        className="text-[25px] font-medium text-first w-full mt-[45px] mb-[30px]"
        id="branchs"
      >
        Downstreams
      </div>
      {downStream.map((item) => (
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
            className="border  border-border text-first rounded-[20px] p-[30px] h-[292px] flex overflow-hidden mb-[30px]"
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
              <div className="flex items-center justify-between leading-[18px]">
                <div className="flex items-center">
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
                <span className="text-ratio font-semibold">
                  {item.ratio * 100}%
                </span>
              </div>
              <div
                className={clsx(
                  'mt-[10px] w-full text-[25px] font-medium',
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
              <div className={clsx('mt-[10px] ', styles.ellipsis)}>
                {item.subTitle || '-'}
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
                  <span className="text-[#5E5E5E] text-[14px] ml-1">Likes</span>
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
      {downStream.length > 0 && (
        <div className="flex items-center justify-center text-first">
          {isMore && (
            <div
              className="h-8  cursor-pointer"
              onClick={() => setSize(size + 1)}
            >
              Load more
            </div>
          )}
          {isValidating && (
            <div className="h-8">
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
              loading
            </div>
          )}
        </div>
      )}
      {downStream.length === 0 && !isValidating && (
        <div className="text-first text-left w-full">
          Not any more down streams!
        </div>
      )}
    </>
  );
};
export default Branchs;
