import { memo, useState } from 'react';
import ModalPro from 'src/components/ModalPro';
import type { PieceDetailData } from 'src/data/use-piece-detail';
import styles from './index.module.less';
import StreamWater from './StreamWater';
import StreamWeb3 from './StreamWeb3';
import { Tabs, TabsProps } from 'antd';
import { ReactComponent as LittleWaterIcon } from 'src/assets/media/svg/icon-little-water.svg';
import { ReactComponent as EverpayIcon } from 'src/assets/media/svg/icon-everpay.svg';
import clsx from 'clsx';
import useCascadInfo from 'src/hooks/use-cascad-info';

interface StreamCreatorModalProps {
  visible: boolean;
  handleClose: (isMutate: boolean, type: string, amount?: string) => void;
  pieceDetail?: PieceDetailData;
}

const StreamCreatorModal = (props: StreamCreatorModalProps) => {
  const { visible, handleClose, pieceDetail } = props;

  const [streamType, setStreamType] = useState('1'); // 打赏方式 1： 水滴 2：链上

  /** hook-空间详情 */
  const { cascadDetail } = useCascadInfo();

  /** 关闭 */
  const onCancel = (isMutate: boolean, amount?: string) => {
    handleClose(isMutate, streamType, amount);
    setStreamType('1');
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex font-semibold items-center text-[#5A8C93]">
          <LittleWaterIcon className="relative top-[2px] mr-2" />
          Drop
        </div>
      ),
      children: <StreamWater onCancel={onCancel} pieceDetail={pieceDetail} />,
    },
    cascadDetail?.isWeb3 && {
      key: '2',
      label: (
        <div className="flex font-semibold items-center text-first">
          <EverpayIcon className="mr-2" />
          Everpay
        </div>
      ),
      children: <StreamWeb3 onCancel={onCancel} pieceDetail={pieceDetail} />,
    },
  ].filter(Boolean) as TabsProps['items'];

  return (
    <ModalPro
      open={visible}
      width={570}
      title="Stream"
      onCancel={() => onCancel(false)}
      className={styles.modal}
      destroyOnClose
      footer={null}
    >
      <div className="m-[0_auto] text-first">
        <div className="text-second">Receiver</div>
        <div className="text-[20px] mt-2 leading-[28px]">
          {pieceDetail?.authorUsername}
        </div>
        <Tabs
          activeKey={streamType}
          items={items}
          destroyInactiveTabPane
          className={clsx({
            [styles.drop]: streamType === '1',
            [styles.everypay]: streamType === '2',
          })}
          onChange={(key) => setStreamType(key)}
        />
      </div>
    </ModalPro>
  );
};
export default memo(StreamCreatorModal);
