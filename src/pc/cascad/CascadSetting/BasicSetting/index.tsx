import { Avatar, Checkbox, Form, Input, Modal, message } from 'antd';
import { ReactComponent as UploadIcon } from 'src/assets/media/svg/icon-upload.svg';
import { useEffect, useState } from 'react';
import useRouterParams from 'src/hooks/use-router-params';
import { updateCascadeReq } from 'src/api/cascad';
import { mutate } from 'swr';
import useCascadInfo from 'src/hooks/use-cascad-info';
import { delCascadeReq } from 'src/api/cascad/piece';
import { useRouter } from 'next/router';
import { ExclamationCircleFilled } from '@ant-design/icons';
import UploadImage from 'src/components/UploadImage';

const BasicSetting = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { cascadId } = useRouterParams();

  /** hook-空间详情 */
  const { cascadDetail } = useCascadInfo();

  const [logoUrl, setLogoUrl] = useState(''); // logo
  const [coverUrl, setCoverUrl] = useState(''); // coverUrl
  const [commitLoading, setCommitLoading] = useState(false); // 提交loading

  /** 回显 */
  useEffect(() => {
    if (cascadDetail) {
      setLogoUrl(cascadDetail.logoUrl);
      setCoverUrl(cascadDetail.coverUrl);
      form.setFieldsValue({
        ...cascadDetail,
        taxRatio: cascadDetail.taxRatio * 100,
      });
    }
  }, [cascadDetail, form]);

  /** upload cascad log */
  const handleChangeLogo = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.itemId) {
        message.success('Upload success!');
        setLogoUrl(info.file.response.itemId);
      } else {
        message.error(info.file.response.msg);
      }
    }
  };

  /** upload cascad log */
  const handleChangeCover = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.itemId) {
        message.success('Upload success!');
        setCoverUrl(info.file.response.itemId);
      } else {
        message.error(info.file.response.msg);
      }
    }
  };

  /** 提交 */
  const onFinish = async (values: any) => {
    try {
      setCommitLoading(true);
      const params = {
        ...values,
        logoUrl,
        coverUrl,
        taxRatio: Number(values.taxRatio) / 100,
      };
      const res = await updateCascadeReq(params, cascadId);
      if (res.data.status) {
        message.success('Success!');
        mutate(['/client/cascade/home/enter', cascadId]);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };

  /** 删除空间 */
  const deleteCascade = () => {
    Modal.confirm({
      title: 'Are you sure delete this Cascade?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          if (commitLoading) return;
          setCommitLoading(true);
          const res = await delCascadeReq(cascadId);
          if (res.data.data) {
            message.success('Success!');
            router.push('/');
          }
        } catch (error) {
          message.error((error as Error).message);
        } finally {
          setCommitLoading(false);
        }
      },
    });
  };

  return (
    <div className="pb-12 w-[714px]">
      <Form
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        form={form}
      >
        <Form.Item
          name="name"
          rules={[{ required: true }]}
          label="Cascade Name"
          className="formLabel !mb-[35px]"
        >
          <Input className="input" placeholder="Enter a cascade name." />
        </Form.Item>
        <div className="label">Cascade Logo</div>
        <div className="flex mb-[35px]">
          <div className="border-[rgba(136, 136, 136, 0.6)] border hover:shadow-hover rounded-[40px]">
            <UploadImage
              width={200}
              cropShape={'round'}
              height={200}
              onChange={handleChangeLogo}
            >
              <div className="flex items-center h-[45px] rounded-[40px] px-5">
                <UploadIcon className="mr-5" />
                <div>Add Logo File</div>
              </div>
            </UploadImage>
          </div>
          {logoUrl && <Avatar size={48} src={logoUrl} className="!ml-6" />}
        </div>
        <div className="label">Cascade Cover</div>
        <div className="flex mb-[35px]">
          <div className="border-[rgba(136, 136, 136, 0.6)] border hover:shadow-hover rounded-[40px]">
            <UploadImage width={367} height={200} onChange={handleChangeCover}>
              <div className="flex items-center h-[45px] rounded-[40px] px-5">
                <UploadIcon className="mr-5" />
                <div>Add Cover File</div>
              </div>
            </UploadImage>
          </div>
          {coverUrl && <Avatar size={48} src={coverUrl} className="!ml-6" />}
        </div>
        <Form.Item
          name="treasuryAddress"
          // 保存空间信息时显示金库地址必填，应为非必填 #117
          // rules={[{ required: true }]}
          label="TreasuryAddress"
          className="formLabel  !mb-[35px]"
        >
          <Input className="input" />
        </Form.Item>
        <Form.Item
          name="taxRatio"
          label="Tax rate"
          className="formLabel  !mb-[35px]"
          rules={[
            {
              required: true,
              message: 'Please give it a Tax rate.',
            },
            {
              pattern: /^(?:100(?:\.0)?|\d{1,2}(?:\.\d)?)$/,
              message: 'Please enter decimals from 0 to 100.',
            },
          ]}
        >
          <Input className="input !w-[96px]" suffix="%" />
        </Form.Item>
        <Form.Item
          className="!mb-[35px]"
          name="pieceHaveUpstream"
          valuePropName="checked"
        >
          <Checkbox>All posts need to have upstream</Checkbox>
        </Form.Item>
      </Form>
      <div>
        {cascadDetail?.role === 0 && (
          <div>
            <span
              className="mt-[6px] underline text-[rgba(131,59,59,1)] text-[14px] cursor-pointer"
              onClick={deleteCascade}
            >
              Delete Cascade
            </span>
            <div className="mt-2 text-[14px]">
              By deleting this organization, you permanently delete all
              associated data. There's no turning back!
            </div>
          </div>
        )}
        <div className="mt-4">
          <button className="button-green !h-[48px]" onClick={form.submit}>
            {commitLoading && (
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default BasicSetting;
