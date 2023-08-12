import { Input, message } from 'antd';
import { memo, useEffect, useState } from 'react';
import { createCascadAboutReq } from 'src/api/cascad';
import ModalPro from 'src/components/ModalPro';
import useRouterParams from 'src/hooks/use-router-params';

interface AboutModalProps {
  open: boolean;
  data?: string;
  handleCancel: (isMutate?: boolean) => void;
}

const AboutModal = (props: AboutModalProps) => {
  const { open, data, handleCancel } = props;
  const { cascadId } = useRouterParams();

  const [commitLoading, setCommitLoading] = useState(false);
  const [value, setValue] = useState('');

  /** 设置数据 */
  useEffect(() => {
    if (data) setValue(data);
  }, [data]);

  const commitAbout = async () => {
    try {
      if (value.length > 160) {
        message.warning('Maximum 160 characters');
        return;
      }
      setCommitLoading(true);
      const res = await createCascadAboutReq(value, cascadId);
      if (res.data.status) {
        message.success('Success!');
        handleCancel(true);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };
  return (
    <ModalPro
      title="About"
      open={open}
      onCancel={() => handleCancel(false)}
      footer={false}
    >
      <Input.TextArea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        rows={6}
        className="textArea"
      />
      <div className="flex text-[14px] justify-end  text-[rgba(136,136,136,0.9)]">
        <span
          style={{
            color: value.length > 160 ? '#ff401a' : 'rgba(136,136,136,0.9)',
          }}
        >
          {value.length}
        </span>
        /160
      </div>
      <div className="flex mt-4 justify-between">
        <span className="text-[rgba(136,136,136,0.9)]">
          Maximum 160 characters
        </span>
        <button
          className="button-grey-noshadow h-[36px] px-5"
          onClick={commitAbout}
        >
          {commitLoading && (
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
          )}
          Save
        </button>
      </div>
    </ModalPro>
  );
};
export default memo(AboutModal);
