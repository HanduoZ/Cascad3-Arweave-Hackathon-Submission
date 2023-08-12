import { memo, useState } from 'react';
import ModalPro from 'src/components/ModalPro';
import styles from './index.module.less';
import { ReactComponent as EverpayIcon } from 'src/assets/media/svg/icon-everpay.svg';
import type { PieceDetailData } from 'src/data/use-piece-detail';
import { message } from 'antd';

interface ConfirmModalProps {
  visible: boolean;
  /** 弹框关闭 isMutate -> true：需要刷新数据 false：不需要 */
  onClose: (isSuccess: boolean, hash?: string) => void;
  /** 输入的数量 */
  amount: string;
  /** everypay 生成的bundle数据 */
  bundleData: any;
  /** everypay实例 */
  everpay: any;
  /** 当前选中的币种 */
  currencyType?: { [key: string]: any };
  /** 作品详情 */
  pieceDetail?: PieceDetailData;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    visible,
    onClose,
    amount,
    bundleData,
    everpay,
    currencyType,
    pieceDetail,
  } = props;

  const [loading, setLoading] = useState(false);

  /** 打赏 */
  const handleBundle = async () => {
    try {
      if (loading || !everpay) return;
      setLoading(true);
      // 交易
      const res: any = await everpay.bundle(bundleData);
      if (res) {
        onClose(true, res?.everHash);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ModalPro
      open={visible}
      width={570}
      title="Transfer Details"
      onCancel={() => onClose(false)}
      className={styles.modal}
      destroyOnClose
      footer={null}
    >
      <div className="text-first">
        <div className="pb-[10px] border-b-[1px] border-border">
          <div className="text-[#5E5E5E] mb-[5px]">Network</div>
          <div className="flex items-center">
            <EverpayIcon className="mr-2" />
            Everpay
          </div>
        </div>
        <div className="pb-[10px] mt-[10px] border-b-[1px] border-border">
          <div className="text-[#5E5E5E] mb-[5px]">Receiver</div>
          <div className="flex items-center">{pieceDetail?.authorUsername}</div>
        </div>
        <div className="pb-[10px] mt-[10px] border-b-[1px] border-border">
          <div className="text-[#5E5E5E] mb-[5px]">Receiver</div>
          <div>{pieceDetail?.author.walletAddress}</div>
        </div>
        <div className="pb-[10px] mt-[10px] border-b-[1px] border-border">
          <div className="text-[#5E5E5E] mb-[5px]">Amount</div>
          <div className="flex items-center">
            <span className="mr-1">{amount}</span>
            <span>{currencyType?.symbol}</span>
          </div>
        </div>
        <div className="flex justify-end mt-[30px]">
          <button
            className="border-[rgba(90,140,147,1)] mr-5 bg-white border h-12 rounded-[20px] px-[40px]"
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
          <button className="button-drop" onClick={handleBundle}>
            Confirm
          </button>
        </div>
      </div>
    </ModalPro>
  );
};
export default memo(ConfirmModal);
