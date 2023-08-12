import { Avatar, Form, Input, message } from 'antd';
import UploadImage from 'src/components/UploadImage';
import { ReactComponent as UploadIcon } from 'src/assets/media/svg/icon-upload.svg';
import { memo, useState } from 'react';

interface CreateFirstProps {
  step: number;
  logoUrl: string;
  cascadeName: string;
  changeStep: (step: number) => void;
  changeLogo: (step: string) => void;
}

type ValidateStatus =
  | ''
  | 'success'
  | 'warning'
  | 'error'
  | 'validating'
  | undefined;

const CreateFirst = (props: CreateFirstProps) => {
  const { step, logoUrl, cascadeName, changeStep, changeLogo } = props;

  const [validateNameStatus, setValidateNameStatus] =
    useState<ValidateStatus>('');

  /** upload cascad log */
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.itemId) {
        message.success('Upload success!');
        changeLogo(info.file.response.itemId);
      } else {
        message.error(info.file.response.msg);
      }
    }
  };
  return (
    <div
      className={`flex flex-col items-center ${
        step === 1 ? '' : 'h-0 overflow-hidden'
      }`}
    >
      <div className="text-[38px] leading-[46px] h-[58px] font-medium text-first mb-8">
        Create a Cascade
      </div>
      <div>
        <Form.Item
          name="name"
          label="Give it a name"
          className="!mb-[20px] formLabel"
          rules={[
            {
              required: true,
              message: 'Please give it a name.',
            },
          ]}
          validateStatus={validateNameStatus}
          help={validateNameStatus && 'Please give it a name.'}
        >
          <Input className="input" id="error" placeholder="Enter name" />
        </Form.Item>
        <div className="label">Upload your logo</div>
        <div className="flex mb-4">
          <div className="border-[rgba(136, 136, 136, 0.6)] hover:shadow-hover border rounded-[40px]">
            <UploadImage
              width={200}
              cropShape={'round'}
              height={200}
              onChange={handleChange}
            >
              <div className="flex items-center h-[45px] rounded-[40px] px-5">
                <UploadIcon className="mr-5" />
                <div>Add your logo</div>
              </div>
            </UploadImage>
          </div>
          {logoUrl && <Avatar size={48} src={logoUrl} className="!ml-6" />}
        </div>
        <Form.Item
          name="cascadeUsage"
          className="!mb-[30px] formLabel"
          label="What do you use it for?"
        >
          <Input
            className="input"
            placeholder="So we can design it better to fit your needs"
          />
          {/* <Select
        mode="multiple"
        className="select"
        placeholder="Please select one or more cascad usage."
        options={cascadeUsagesList.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        filterOption={(input, option) =>
          (option?.label ?? '')
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        suffixIcon={<SelectSuffixIcon />}
      /> */}
        </Form.Item>
      </div>
      <div
        className="flex flex-col justify-end"
        style={{ width: 'calc(100vw - 320px)' }}
      >
        <div className="flex justify-end">
          <button
            className="button-green mt-12"
            onClick={(e) => {
              e.preventDefault();
              if (!cascadeName) {
                setValidateNameStatus('error');
                return;
              }
              setValidateNameStatus('');
              changeStep(2);
            }}
          >
            Next
          </button>
        </div>
        <div className="text-[20px] text-right mt-7 text-first">
          *You can edit it later
        </div>
      </div>
    </div>
  );
};
export default memo(CreateFirst);
