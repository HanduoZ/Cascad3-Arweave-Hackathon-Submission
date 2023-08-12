import { Avatar, Space, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { ReactComponent as WaterIcon } from 'src/assets/media/svg/icon-water.svg';
import useUserPieceReq from 'src/data/use-cascade-user-piece-list';
import type { PieceInUserProfileInfo } from 'src/data/use-cascade-user-piece-list';
import useRouterParams from 'src/hooks/use-router-params';
import { DEFAULT_PAGE_SIZE } from 'src/utils/statics';
import useUserInfo from 'src/hooks/use-user-info';
import { UserOutlined } from '@ant-design/icons';
import PieceItem from './PieceItem';
import { floorFixedNumber } from 'src/utils/common';
import usePieceCountReq from 'src/data/use-user-piece-count';

const state = [
  {
    label: 'Published',
    value: '10',
  },
  {
    label: 'Draft',
    value: '0',
  },
  // {
  //   label: 'TBM',
  //   value: '11',
  // },
  {
    label: 'Taken-Down',
    value: '20',
  },
];

const PersonalCenter = () => {
  const { cascadId } = useRouterParams();

  const { data: userInfo } = useUserInfo();

  /** 状态：0，草稿，10：发布，20：下架 */
  const [currState, setCurrState] = useState('10');
  // const [total, setTotal] = useState(0); // 总作品
  const [pieceListData, setPieceListData] = useState<PieceInUserProfileInfo[]>(
    []
  );

  /** 接口-个人中心 */
  const { data, size, currentTotal, setSize, isValidating, isLoading, mutate } =
    useUserPieceReq({
      cascadeId: cascadId,
      currState,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  /** 接口-未读消息数量 */
  const { data: total } = usePieceCountReq({
    cascadId,
  });

  /** 设置数据 */
  useEffect(() => {
    setPieceListData(
      data ? ([] as PieceInUserProfileInfo[]).concat(...data) : []
    );
  }, [data]);
  /** 设置总的total */
  // useEffect(() => {
  //   if (currState && currentTotal) setTotal(currentTotal);
  // }, [currState, currentTotal]);

  /** 是否还有更多 */
  const isMore = !isValidating && pieceListData.length < currentTotal;

  /** 上链成功回调 */
  const upperSuccessCallBack = useCallback(
    (id: number) => {
      mutate();
    },
    [mutate]
  );

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
        <Space size={30} className="mt-[38px]">
          {state.map((item) => (
            <div
              key={item.value}
              className={`text-first cursor-pointer text-[20px] ${
                currState === item.value && '!underline font-medium'
              }`}
              onClick={() => setCurrState(item.value)}
            >
              {item.label}
            </div>
          ))}
        </Space>
        <div className="mt-6 w-full">
          {isLoading && (
            <div className="flex items-center h-[200px] justify-center">
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
              loading
            </div>
          )}
          {!isLoading && data && pieceListData.length === 0 && (
            <div className="flex items-center h-[200px] justify-center">
              No piece currently available
            </div>
          )}
          {pieceListData.map((item) => (
            <PieceItem
              key={item.id}
              currState={currState}
              data={item}
              upperSuccessCallBack={upperSuccessCallBack}
            />
          ))}
          {pieceListData.length > 0 && (
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
              {pieceListData.length >= currentTotal && (
                <div>Reaching the Edge of the Posts</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalCenter;
