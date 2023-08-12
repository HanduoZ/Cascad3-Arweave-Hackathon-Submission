import PieceCard from 'src/components/PieceCard';
import { ReactComponent as LinkLineIcon } from 'src/assets/media/svg/icon-link-line.svg';
import { ReactComponent as ShortLinkLineIcon } from 'src/assets/media/svg/icon-short-link-line.svg';
import { ReactComponent as LocationIcon } from 'src/assets/media/svg/icon-location.svg';
import usePieceUpStreamReq from 'src/data/use-piece-up-stream';
import useRouterParams from 'src/hooks/use-router-params';
import usePieceDetailReq from 'src/data/use-piece-detail';
import usePieceDownStreamReq from 'src/data/use-piece-down-stream';
import type { PieceStreamInfo } from 'src/data/use-piece-down-stream';
import { DEFAULT_PAGE_SIZE } from 'src/utils/statics';
import Search from '../../components/Search';
import { useRef } from 'react';

const Stream = () => {
  const loadingBoxRef = useRef<any>();
  const { cascadId, pieceUuid } = useRouterParams();

  /** 接口-文章详情 */
  const {
    data: pieceDetail,
    isLoading: pieceDetailValidating,
    mutate: currentMutate,
  } = usePieceDetailReq(pieceUuid, cascadId);

  /** 接口-文章上游 */
  const { data: upStream = [], mutate: upStreamMutate } = usePieceUpStreamReq({
    pieceUuid: pieceUuid,
    cascadId,
  });

  /** 接口-文章下游 */
  const {
    data = [],
    size,
    setSize,
    isValidating,
    mutate: downStreamMutate,
  } = usePieceDownStreamReq({
    pieceUuid: pieceUuid,
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

  /** 滚动加载 */
  const onScroll = (e: any) => {
    const box = e.target;
    //  loading
    const { top: loadingRectTop } =
      loadingBoxRef.current?.getBoundingClientRect();
    //  滚动盒子
    const { top: boxRectTop, height: boxHeight } = box?.getBoundingClientRect();
    if (
      loadingRectTop - boxRectTop <= boxHeight + 10 &&
      isMore &&
      !isValidating
    ) {
      setSize(size + 1);
    }
  };

  return (
    <div className="p-[20px_0_24px_12px] mt-[18px] rounded-[10px] border border-border-second shadow-shadow-second">
      <Search />
      <div
        className="min-h-[200px] max-h-[400px] pr-3 overflow-y-auto"
        onScroll={onScroll}
      >
        {pieceDetailValidating && (
          <div className="flex h-[140px] items-center justify-center">
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
            loading
          </div>
        )}
        <div className="w-[252px]">
          {upStream.map((item, index) => (
            <div key={item.id} className="mt-5 relative">
              <PieceCard
                zIndex="z-[30]"
                data={{ ...item, isShow: false }}
                mutate={upStreamMutate}
              />
              {pieceDetail &&
                (index === upStream.length - 1 ? (
                  <>
                    <ShortLinkLineIcon className="absolute left-[18px] -bottom-[72px] z-[20]" />
                  </>
                ) : (
                  <div className="absolute left-[18px] h-[22px] w-[2px] bg-[rgba(136,136,136,0.9)] rounded-full" />
                ))}
            </div>
          ))}
        </div>
        {pieceDetail && !pieceDetailValidating && (
          <div
            className={`bg-[#E4E0E0] rounded-[10px] h-[107px] mt-4 pt-[15px] flex ${
              upStream.length > 0 ? 'pl-[44px]' : 'pl-[14px]'
            }`}
          >
            <div className="flex-1 overflow-hidden pr-2 relative">
              <PieceCard
                data={{ ...pieceDetail, isShow: true }}
                zIndex="z-10"
                mutate={downStreamMutate}
                showRatio={false}
              />
            </div>
            <div className="w-[76px] mt-1">
              <div className="text-center">
                <LocationIcon />
              </div>
              <div className="text-center text-[14px] leading-4">
                You are here
              </div>
            </div>
          </div>
        )}
        <div
          className={`mt-4 ${upStream.length > 0 ? 'pl-[94px]' : 'pl-[64px]'}`}
        >
          {downStream.map((item, index) => (
            <div className="w-full pr-2 relative  mb-8" key={item.id}>
              <PieceCard
                data={{ ...item, isShow: true }}
                zIndex="z-10"
                mutate={currentMutate}
              />
              {pieceDetail &&
                (index === 0 ? (
                  <ShortLinkLineIcon className="absolute -left-[26px] -top-[32px] z-20" />
                ) : (
                  <LinkLineIcon className="absolute -left-[26px] -top-[112px] z-20" />
                ))}
            </div>
          ))}
        </div>
        <div
          className="h-8 flex items-center justify-center text-first"
          ref={loadingBoxRef}
        >
          {isValidating && downStream.length > 0 && (
            <div>
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
              loading
            </div>
          )}
          {downStream.length >= (pieceDetail?.downstreamCount || 0) &&
            downStream.length > 0 &&
            !isValidating &&
            'Reaching the End of the Cascade'}
        </div>
      </div>
    </div>
  );
};
export default Stream;
