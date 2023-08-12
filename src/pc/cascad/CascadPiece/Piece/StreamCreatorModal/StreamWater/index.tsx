import { InputNumber, Space, message } from 'antd';
import { memo, useEffect, useState } from 'react';
import { rewardReq } from 'src/api/cascad/piece';
import type { PieceDetailData } from 'src/data/use-piece-detail';
import useRouterParams from 'src/hooks/use-router-params';
import useUserInfo from 'src/hooks/use-user-info';
import { floorFixedNumber } from 'src/utils/common';
import { ReactComponent as CheckWaterIcon } from 'src/assets/media/svg/icon-check-water.svg';
import { ReactComponent as CheckedWaterIcon } from 'src/assets/media/svg/icon-checked-water.svg';
import clsx from 'clsx';
import styles from '../index.module.less';

const list = ['2', '8', '18', '68', '98', '198'];

interface StreamWaterProps {
  onCancel: (isMutate: boolean, amount?: string) => void;
  pieceDetail?: PieceDetailData;
}

const StreamWater = (props: StreamWaterProps) => {
  const { onCancel, pieceDetail } = props;
  const { cascadId } = useRouterParams();

  const [amount, setAmount] = useState('2'); // 水滴数量
  const [loading, setLoading] = useState(false);

  /** hook-用户信息 */
  const { data: userInfo, mutate: userInfoMutate } = useUserInfo();

  /** 无法监听弹框卸载，使用组件卸载流程 */
  useEffect(() => {
    return () => {
      setAmount('2');
    };
  }, []);

  /** 打赏 */
  const reward = async () => {
    try {
      if (loading || !pieceDetail?.id) return;
      if (!amount) {
        message.warning('Please enter amount.');
        return;
      }
      setLoading(true);
      const res = await rewardReq(
        {
          amount: Number(amount),
          pieceId: pieceDetail?.id,
        },
        cascadId
      );
      if (res.data.data) {
        userInfoMutate();
        onCancel(true, amount);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="text-second my-6">Enter Amount</div>
      <Space size={30}>
        {list.map((item) => (
          <div
            key={item}
            className="flex cursor-pointer w-[50px] h-[60px] relative items-center justify-center"
            onClick={() => setAmount(item)}
          >
            <span
              className={`text-[20px] relative z-10 font-semibold top-1 ${
                item === amount ? 'text-white' : ''
              }`}
            >
              {item}
            </span>
            <CheckWaterIcon className="absolute left-0 top-0" />
            {item === amount && (
              <CheckedWaterIcon className="absolute left-0 top-0" />
            )}
          </div>
        ))}
      </Space>
      <div className="flex flex-col items-center">
        <div className="rounded-[10px] flex flex-col items-center pt-[10px] border border-second w-[166px] h-[102px] m-[0_auto] mt-6">
          <InputNumber
            bordered={false}
            className={clsx(
              'text-center !w-full h-[42px] !text-[25px] !text-second',
              styles.inputNumber
            )}
            value={amount}
            onChange={(value) => {
              if (
                Number(value) < floorFixedNumber(userInfo?.tokenAmount || 0, 2)
              ) {
                setAmount(value || '');
              }
            }}
          />
          <div className="text-second leading-[18px]">Enter amount</div>
          <div
            className="underline cursor-pointer"
            onClick={() =>
              setAmount(floorFixedNumber(userInfo?.tokenAmount || 0, 2) + '')
            }
          >
            Max
          </div>
        </div>
        <span className="underline mt-[10px]">
          Current Balance:
          {floorFixedNumber(userInfo?.tokenAmount || 0, 2)}
        </span>
      </div>
      <div className="flex justify-end items-end mt-[25px] pb-4">
        <div className="button-green" onClick={reward}>
          {loading && (
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
          )}
          Stream
        </div>
      </div>
    </>
  );
};
export default memo(StreamWater);
