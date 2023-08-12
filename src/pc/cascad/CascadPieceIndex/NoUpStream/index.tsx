import { useRef } from 'react';
import useNoPieceUpStreamReq from 'src/data/use-piece-no-up-stream';
import type { PieceStreamInfo } from 'src/data/use-piece-no-up-stream';
import useRouterParams from 'src/hooks/use-router-params';
import { DEFAULT_PAGE_SIZE } from 'src/utils/statics';
import PieceCard from 'src/components/PieceCard';
import Search from '../../components/Search';

const NoUpStream = () => {
  const loadingBoxRef = useRef<any>();

  const { cascadId } = useRouterParams();

  /** 接口-获取无上游作品 */
  const {
    data,
    size,
    setSize,
    total,
    isValidating,
    mutate: noUpStreamMutate,
  } = useNoPieceUpStreamReq({
    cascadId,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  /** 构建数据 */
  const pieceList = data ? ([] as PieceStreamInfo[]).concat(...data) : [];

  /** 是否还有更多 */
  const isMore = pieceList.length < total;

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
      console.log(size + 1);

      setSize(size + 1);
    }
  };

  return (
    <div className="p-[12px_0_24px_12px] mt-[18px] rounded-[10px] border border-border-second shadow-second">
      <Search />
      <div
        className="mt-8 min-h-[200px] max-h-[400px] overflow-y-auto pr-3"
        onScroll={onScroll}
      >
        {pieceList.map((item, index) => (
          <div className="mb-4" key={item.uuid}>
            <PieceCard
              data={{ ...item, isShow: false }}
              mutate={noUpStreamMutate}
              showRatio={false}
            />
          </div>
        ))}
        <div ref={loadingBoxRef} className="flex items-center justify-center">
          {isValidating ? (
            <>
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
              loading
            </>
          ) : (
            !isMore && 'Reaching the End of the Cascade'
          )}
        </div>
      </div>
    </div>
  );
};
export default NoUpStream;
