import { useEffect, useRef } from 'react';
import About from '../components/About';
import Featured from '../components/Featured';
import Piece from './Piece';
import Stream from './Stream';
import useRouterParams from 'src/hooks/use-router-params';

const CascadPiece = () => {
  const { pieceUuid } = useRouterParams();
  const scrollRef = useRef<any>(null);

  /** 页面滚动顶部 */
  useEffect(() => {
    if (pieceUuid && scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
  }, [pieceUuid]);
  return (
    <div className="h-full flex">
      <div className="w-[452px] pl-8 h-full overflow-y-auto pr-2 pb-6">
        <About />
        <Featured />
        <Stream />
      </div>
      <div
        className="h-full pl-[30px] pt-2 flex-1 overflow-y-auto"
        ref={scrollRef}
      >
        <Piece />
      </div>
    </div>
  );
};
export default CascadPiece;
