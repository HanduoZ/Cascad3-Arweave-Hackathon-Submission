import { Form, Input, message } from 'antd';
import { useCallback, useState } from 'react';
import { createCascadReq } from 'src/api/cascad';
import { useRouter } from 'next/router';
import CreateFirst from './CreateFirst';
import CreateSecond from './CreateSecond';

const Home = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [step, setStep] = useState(1); // 1：input base setting 2: Treasury address 3: set web3
  const [commitLoading, setCommitLoading] = useState(false); // 提交loading
  const [logoUrl, setLogoUrl] = useState(''); // logo

  const isWeb3 = Form.useWatch('isWeb3', form); // 是否是web3
  const cascadeName = Form.useWatch('name', form); // 空间name

  /** 提交 */
  const onFinish = async (values: any) => {
    try {
      if (commitLoading) return;
      setCommitLoading(true);
      const params = {
        ...values,
        logoUrl,
        taxRatio: Number(values.taxRatio) / 100,
      };
      const res = await createCascadReq(params);
      if (res.data.data) {
        message.success('Success!');
        router.push(`/${res.data.data.cascadeId}`);
      }
    } catch (error) {
      message.error((error as Error).message);
      setCommitLoading(false);
    }
  };

  /** 修改步骤 */
  const changeStep = useCallback((step: number) => {
    setStep(step);
  }, []);

  /** 修改步骤 */
  const changeLogo = useCallback((url: string) => {
    setLogoUrl(url);
  }, []);
  return (
    <div className="h-full text-first flex justify-center items-center">
      <Form
        form={form}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        initialValues={{
          isWeb3: true,
        }}
        colon={false}
        layout="vertical"
      >
        <CreateFirst
          logoUrl={logoUrl}
          changeLogo={changeLogo}
          step={step}
          cascadeName={cascadeName}
          changeStep={changeStep}
        />
        <CreateSecond isWeb3={isWeb3} step={step} changeStep={changeStep} />
        <div
          className={`flex  flex-col items-center ${
            step === 3 ? '' : 'h-0 overflow-hidden'
          }`}
        >
          <div className="text-[38px] leading-[46px] h-[58px] font-medium text-first mb-8">
            Set up the treasury
          </div>
          <div>
            <Form.Item
              name="taxRatio"
              className="!mb-[20px] formLabel"
              label="Tax rate"
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
              <Input
                className="input"
                placeholder="Enter Tax rate"
                suffix="%"
              />
            </Form.Item>
            <Form.Item
              name="treasuryAddress"
              label="Treasury address"
              className="!mb-[20px] formLabel"
              rules={[
                {
                  required: isWeb3,
                  message: 'Please give it a treasury address.',
                },
              ]}
            >
              <Input className="input" placeholder="Enter treasury address" />
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
                    changeStep(2);
                  }}
                >
                  Back
                </button>
              </div>
              <div className="flex ml-[30px] justify-end">
                <button
                  className="button-green mt-12"
                  onClick={(e) => {
                    e.preventDefault();
                    form.submit();
                  }}
                >
                  {commitLoading && (
                    <span className="mr-2">
                      <i className="fa fa-circle-o-notch fa-spin " />
                    </span>
                  )}
                  Next
                </button>
              </div>
            </div>
            <div className="text-[20px] text-right mt-7 text-first">
              *You can edit it later
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default Home;
