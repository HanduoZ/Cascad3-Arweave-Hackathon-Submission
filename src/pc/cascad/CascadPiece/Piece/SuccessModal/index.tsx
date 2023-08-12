import { memo, useMemo } from 'react';
import ModalPro from 'src/components/ModalPro';
import { ReactComponent as LittleWaterIcon } from 'src/assets/media/svg/icon-little-water.svg';
import useCascadInfo from 'src/hooks/use-cascad-info';
import { EVERYPAY_TRADE_HOST } from 'src/utils/statics';
import BigNumber from 'bignumber.js';

interface SuccessModalProps {
  visible: boolean;
  onCancel: () => void;
  data?: any;
}

const SuccessModal = (props: SuccessModalProps) => {
  const { visible, onCancel, data } = props;

  /** hook-空间详情 */
  const { cascadDetail } = useCascadInfo();

  // 数据
  const destination = useMemo(() => {
    if (data?.type === '1' && data) {
      const amountNum = new BigNumber(Number(data?.amount));
      const ratioNum = new BigNumber(cascadDetail?.taxRatio || 0);
      const toCascade = amountNum.times(ratioNum).toString();
      const toCreator = amountNum.minus(new BigNumber(toCascade)).toString();

      return {
        toCreator,
        toCascade,
      };
    }
  }, [cascadDetail?.taxRatio, data]);

  return (
    <ModalPro
      open={visible}
      width={460}
      onCancel={onCancel}
      destroyOnClose
      footer={null}
    >
      <div className="text-first p-[60px]">
        <div className="pb-[25px] text-[25px] text-center">Stream Success!</div>
        {data?.type === '1' ? (
          <div>
            <div className="pb-[10px] mt-[10px] border-b-[1px] border-border">
              <div className="text-[#5E5E5E] mb-[5px]">Total Stream:</div>
              <div className="flex items-center">
                <LittleWaterIcon className="mr-1 relative top-[2px]" />
                {data?.amount}
              </div>
            </div>
            <div className="pb-[10px] mt-[10px] border-b-[1px] border-border">
              <div className="text-[#5E5E5E] mb-[5px]">To Creator(s):</div>
              <div className="flex items-center">
                <LittleWaterIcon className="mr-1 relative top-[2px]" />
                {destination?.toCreator}
              </div>
            </div>
            <div className="pb-[10px] mt-[10px] border-b-[1px] border-border">
              <div className="text-[#5E5E5E] mb-[5px]">
                To Treasury (Tax rate {(cascadDetail?.taxRatio || 0) * 100}%):
              </div>
              <div className="flex items-center">
                <LittleWaterIcon className="mr-1 relative top-[2px]" />
                {destination?.toCascade}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mt-[15px]">
            <div
              className="button-drop !px-[15px]"
              onClick={() => {
                window.open(EVERYPAY_TRADE_HOST + data?.amount);
              }}
            >
              Check Transaction History
            </div>
          </div>
        )}
      </div>
    </ModalPro>
  );
};
export default memo(SuccessModal);
