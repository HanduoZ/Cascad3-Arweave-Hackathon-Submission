import { Checkbox, Form, Radio } from 'antd';
import { memo } from 'react';
import styles from './index.module.less';

interface CreateSecondProps {
  step: number;
  isWeb3: boolean;
  changeStep: (step: number) => void;
}

const CreateSecond = (props: CreateSecondProps) => {
  const { step, changeStep } = props;

  return (
    <div
      className={`flex flex-col items-center ${
        step === 2 ? '' : 'h-0 overflow-hidden'
      }`}
    >
      <div className="text-[25px] leading-[34px] text-center font-medium text-first mb-[15px]">
        Is this a Web3-only Cascade?
      </div>
      <div className="text-[20px] mb-10">
        *You <span className="text-[#833B3B]">CANNOT</span> edit this once it’s
        set up
      </div>
      <div>
        <Form.Item name="isWeb3" className="!mb-10">
          <Radio.Group className={styles.radioGroup}>
            <Radio
              value={true}
              className="!h-[52px] !text-[20px] !mb-5 !text-first"
            >
              Yes, it enables more payment options but all members need to
              connect their Web3 wallet to start creating.
            </Radio>
            <Radio value={false} className="!text-[20px] !text-first">
              No, it’s for everyone.
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          className="!mb-0"
          name="pieceHaveUpstream"
          valuePropName="checked"
        >
          <Checkbox className="!text-[20px] !text-first">
            All posts need to have upstream
          </Checkbox>
        </Form.Item>
      </div>
      <div
        className="flex flex-col items-end justify-end"
        style={{ width: 'calc(100vw - 320px)' }}
      >
        <div className="flex items-center">
          <div className="flex justify-end">
            <button
              className="button-grey mt-12"
              onClick={(e) => {
                e.preventDefault();
                changeStep(1);
              }}
            >
              Back
            </button>
          </div>
          <div className="flex ml-[30px] justify-end">
            <div className="flex ml-[30px] justify-end">
              <button
                className="button-green mt-12"
                onClick={(e) => {
                  e.preventDefault();
                  changeStep(3);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(CreateSecond);
