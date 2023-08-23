import { ExclamationCircleFilled } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { memo } from 'react';
import ModalPro from 'src/components/ModalPro';
import useUserInfo from 'src/hooks/use-user-info';

interface ConfirmProps {
  visible: boolean;
  loading: boolean;
  handleCancle: (isPublish: boolean) => void;
}

const Confirm = (props: ConfirmProps) => {
  const { visible, loading, handleCancle } = props;
  const { data: userInfo } = useUserInfo();

  return (
    <ModalPro
      open={visible}
      width={600}
      onCancel={() => handleCancle(false)}
      footer={null}
    >
      <div className="pt-[62px]">
        <div className="text-first flex ">
          <ExclamationCircleFilled
            className="text-[24px] mr-4"
            style={{ color: '#ffb700' }}
          />
          <span>
            Please note that the upstreams and their percentages CAN NOT be
            edited later once submitted.
          </span>
        </div>
        <div className="flex items-center mt-8 justify-between">
          <Checkbox
            onChange={(e) => {
              if (e.target.checked)
                localStorage.setItem(`showNotice-${userInfo?.id}`, 'false');
            }}
          >
            Don't show this again.
          </Checkbox>
          <div className="flex items-center">
            <button
              className="button-grey-noshadow !bg-white text-[20px] h-12 px-[30px] mr-4"
              onClick={() => handleCancle(false)}
            >
              Go Back
            </button>
            <button
              className="button-grey-noshadow h-12 text-[20px] px-[30px]"
              onClick={() => handleCancle(true)}
            >
              {loading && (
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
              )}
              Publish
            </button>
          </div>
        </div>
      </div>
    </ModalPro>
  );
};
export default memo(Confirm);
