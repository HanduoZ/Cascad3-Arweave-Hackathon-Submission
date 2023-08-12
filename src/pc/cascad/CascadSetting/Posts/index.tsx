import { ReactNode, useCallback, useEffect, useState } from 'react';
import type { PieceInAdminInfo } from 'src/data/use-cascade-piece-list';
import useCascadePieceListReq from 'src/data/use-cascade-piece-list';
import useRouterParams from 'src/hooks/use-router-params';
import { DEFAULT_PAGE_SIZE } from 'src/utils/statics';
import { statusType } from '../static';
import { ReactComponent as DownIcon } from 'src/assets/media/svg/icon-down.svg';
import { Space, message } from 'antd';
import Search from 'src/components/Search';
import { pieceTakeDownReq, reviewPieceReq } from 'src/api/cascad/piece';
import PopoverPro from 'src/components/PopoverPro';
import Link from 'next/link';

const Posts = () => {
  const { cascadId } = useRouterParams();

  /** 状态 ，1：Unread，2：published，3：Taken-down */
  const [tabType, setTabType] = useState('1');
  const [keyword, setKeyword] = useState('');
  const [pieceListData, setPieceListData] = useState<PieceInAdminInfo[]>([]);
  const [loading, setLoading] = useState(false); // 提交loading

  const { data, error, size, setSize, total } = useCascadePieceListReq({
    pageSize: DEFAULT_PAGE_SIZE,
    cascadId,
    tabType,
    keyword,
  });

  /** 设置数据 */
  useEffect(() => {
    setPieceListData(data ? ([] as PieceInAdminInfo[]).concat(...data) : []);
  }, [data]);

  /** 初始数据 */
  const isLoadingInitialData = !data && !error;

  /** 正在加载更多 */
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  /** 判断数据是否为空 */
  const isEmpty = data?.[0]?.length === 0;

  /** 所有数据加载完毕 */
  const isReachingEnd = isEmpty || pieceListData.length === total;

  /** 搜索 */
  const onChangeKeyword = useCallback((value: any) => {
    setKeyword(value);
  }, []);

  /** 审阅 */
  const reviewPiece = async (id: number) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await reviewPieceReq(id, cascadId);
      if (res.data.data) {
        message.success('Success!');
        setPieceListData((data) => data.filter((item) => item.id !== id));
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /** 下架 */
  const takeDownPiece = async (id: number) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await pieceTakeDownReq(id, cascadId);
      if (res.data.data) {
        message.success('Success!');
        setPieceListData((data) => data.filter((item) => item.id !== id));
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[714px]">
      <Search onChange={onChangeKeyword} />
      <Space size={30} className="mt-[30px]">
        {statusType.map((item) => (
          <div
            key={item.text}
            className={`text-first cursor-pointer text-[20px] ${
              tabType === item.value && '!underline font-medium'
            }`}
            onClick={() => setTabType(item.value)}
          >
            {item.text}
          </div>
        ))}
      </Space>
      <div className="mt-6">
        {pieceListData.map((item) => (
          <Link key={item.id} href={`/${cascadId}/${item.uuid}`}>
            <div className="h-[102px] flex items-center border-b-[1px] border-border px-[10px]">
              <div className="flex-1 overflow-hidden text-first">
                <div className="text-[20px] font-medium leading-6 overflow-hidden w-[calc(100%-40px)] whitespace-nowrap text-ellipsis">
                  {item.title}
                </div>
                <div className="mt-1 flex items-center">
                  <span className="mr-4">{item.authorUsername}</span>
                  {item.currState === 20 && (
                    <span className="text-second border border-border-second px-2 rounded-xs bg-border-second">
                      Taken-down
                    </span>
                  )}
                </div>
              </div>
              {tabType !== '3' && (
                <PopoverPro
                  items={
                    [
                      !item.isReviewed && {
                        text: (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              reviewPiece(item.id);
                            }}
                          >
                            Reviewed
                          </div>
                        ),
                      },
                      {
                        text: (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              takeDownPiece(item.id);
                            }}
                          >
                            Taken down
                          </div>
                        ),
                      },
                    ].filter(Boolean) as {
                      text: string | ReactNode;
                    }[]
                  }
                  trigger="hover"
                  placement="bottom"
                >
                  <div
                    className="border-border cursor-pointer border h-10 flex items-center rounded-[20px] px-3 text-first"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    setting
                    <DownIcon className="ml-[10px]" />
                  </div>
                </PopoverPro>
              )}
            </div>
          </Link>
        ))}
        <div className="h-[80px] flex items-center justify-center">
          {isLoadingMore ? (
            <div>
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
              loading
            </div>
          ) : isReachingEnd ? (
            'Reaching the Edge of the Posts'
          ) : (
            <span
              className="shrink-0 cursor-pointer"
              onClick={() => setSize(size + 1)}
            >
              Load more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default Posts;
