import { useEffect, useRef } from 'react';
import About from '../components/About';
import Featured from '../components/Featured';
import useRouterParams from 'src/hooks/use-router-params';
// import Link from 'next/link';
// import useUserInfo from 'src/hooks/use-user-info';
import NoUpStream from './NoUpStream';
import G6 from 'src/pc/cascad/CascadPieceIndex/G6';

const CascadPieceIndex = () => {
  const { pieceUuid, cascadId } = useRouterParams();
  const scrollRef = useRef<any>(null);

  // const userInfo = useUserInfo();

  /** 页面滚动顶部 */
  useEffect(() => {
    if (pieceUuid && scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
  }, [pieceUuid]);
  return (
    <div className="h-full flex">
      <div className="w-[452px] pl-8 h-full overflow-y-auto pr-2 pb-6">
        <About />
        <Featured />
        <NoUpStream />
      </div>
      <div className="h-full pt-2 flex-1 overflow-y-auto" ref={scrollRef}>
        <G6 cascadeId={cascadId} />
        {/* <div className="h-[300px] flex justify-center">
          <div className="text-first flex items-center">
            Choose a piece to view or
            <Link
              href={
                userInfo ? `/${cascadId}/writing/new-post` : '/login'
              }
            >
              <span className="link-underline ml-1">start a new post</span>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default CascadPieceIndex;
