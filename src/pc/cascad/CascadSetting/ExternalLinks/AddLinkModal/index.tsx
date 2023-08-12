import { Avatar, Form, Input, message } from 'antd';
import { memo, useEffect, useState } from 'react';
import ModalPro from 'src/components/ModalPro';
import { ReactComponent as UploadIcon } from 'src/assets/media/svg/icon-upload.svg';
import useRouterParams from 'src/hooks/use-router-params';
import { addOrUpdateLinkReq } from 'src/api/cascad/piece';
import type { CascadeExternalLinkInfo } from 'src/data/use-cascade-external-link-list';
import UploadImage from 'src/components/UploadImage';

interface AddLinkModalProps {
  open: boolean;
  handleCancelCallback: (isRequest: boolean) => void;
  editData?: CascadeExternalLinkInfo;
}

const AddLinkModal = (props: AddLinkModalProps) => {
  const { cascadId } = useRouterParams();
  const { open, handleCancelCallback, editData } = props;

  const [form] = Form.useForm();

  const [iconUrl, setIconUrl] = useState(''); // logo
  const [commitLoading, setCommitLoading] = useState(false); // logo

  /** 回显 */
  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
      setIconUrl(editData.iconUrl);
    }
  }, [editData, form]);

  /** 新增编辑 */
  const onFinish = async (values: any) => {
    try {
      if (commitLoading) return;
      setCommitLoading(true);
      const params = {
        ...values,
        iconUrl,
      };
      if (editData) params.id = editData.id;
      const res = await addOrUpdateLinkReq(params, cascadId);
      if (res.data.status) {
        message.success('Success!');
        onCancel(true);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };

  /** 关闭 */
  const onCancel = (isRequest: boolean) => {
    handleCancelCallback(isRequest);
    form.resetFields();
    setIconUrl('');
  };

  /** upload cascad log */
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.itemId) {
        message.success('Upload success!');
        setIconUrl(info.file.response.itemId);
      } else {
        message.error(info.file.response.msg);
      }
    }
  };

  return (
    <ModalPro
      title="Add new link"
      open={open}
      onCancel={() => onCancel(false)}
      footer={false}
    >
      <Form onFinish={onFinish} autoComplete="off" form={form}>
        <div className="flex mb-4 mt-[38px]">
          <div className="border-[rgba(136, 136, 136, 0.6)] hover:shadow-hover border rounded-[40px]">
            <UploadImage
              width={200}
              cropShape={'round'}
              height={200}
              onChange={handleChange}
            >
              <div className="flex items-center h-[40px] rounded-[40px] px-5">
                <UploadIcon className="mr-5" />
                <div>Add Image</div>
              </div>
            </UploadImage>
          </div>
          {iconUrl && <Avatar size={40} src={iconUrl} className="!ml-6" />}
        </div>
        <div className="text-second mb-3 mt-5">Title</div>
        <Form.Item name="name" rules={[{ required: true }]}>
          <Input className="input" placeholder="Enter a link name." />
        </Form.Item>
        <div className="text-second mb-3 mt-5">URL</div>
        <Form.Item name="link" rules={[{ required: true }]}>
          <Input className="input" placeholder="Enter a URL." />
        </Form.Item>
      </Form>
      <div className="pt-4 flex justify-end">
        <button className="button-green !h-[48px]" onClick={form.submit}>
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
export default memo(AddLinkModal);
