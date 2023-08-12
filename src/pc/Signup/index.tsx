import clsx from 'clsx';
import { useState } from 'react';
import { getVerificationCodeReq, registerReq } from 'src/api/user';
import styles from './index.module.less';
import { md5Pwd, validateEmail } from 'src/utils/common';
import { ReactComponent as VectorIcon } from 'src/assets/media/svg/icon-vector.svg';
import { Form, Input, message } from 'antd';
import { useRouter } from 'next/router';

const SignUpPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const [codeLoading, setCodeLoading] = useState(false);
  const [codeStatus, setCodeStatus] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);

  const [validatedEmail, setValidatedEmail] = useState(false);
  const [validatedCode, setValidatedCode] = useState(false);

  const email = Form.useWatch('email', form);

  /** get code */
  const handleSendCode = async () => {
    try {
      setCodeLoading(true);
      const res = await getVerificationCodeReq({
        codeType: 0,
        email: email.trim(),
      });
      setCodeStatus(true);
      if (res.data.status === 1) setCodeStatus(true);
      setCodeLoading(false);
    } catch (error) {
      message.error((error as Error).message);
      setCodeLoading(false);
    }
  };

  /** create Account */
  const createAccount = async (values: any) => {
    try {
      if (codeLoading) return;
      setCommitLoading(true);
      const res = await registerReq({
        code: values.code.trim(),
        email: values.email.trim(),
        username: values.username?.trim(),
        walletAddress: values.walletAddress?.trim(),
        password: md5Pwd(values.password),
      });
      if (res.data.status === 1) {
        message.success('Success!');
        router.push('/login');
      }
      setCommitLoading(false);
    } catch (error) {
      message.error((error as Error).message);
      setCommitLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center overflow-y-auto">
      <div>
        <div className="flex flex-col items-center ">
          <div className="text-[38px] leading-[46px] h-[58px] font-medium text-first">
            Get started
          </div>
          <div className="text-first text-[25px] leading-[34px] font-medium h-[58px] mt-8">
            Sign up
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Form
            form={form}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={createAccount}
            autoComplete="off"
            layout="vertical"
            colon={false}
          >
            <Form.Item
              name="email"
              className="!mb-4 formLabel"
              label="Email Address"
              validateFirst={true}
              rules={[
                {
                  validator: (_, value) => {
                    if (validateEmail(value)) {
                      setValidatedEmail(true);
                      setCodeStatus(false);
                      return Promise.resolve();
                    } else {
                      setValidatedEmail(false);
                      setCodeStatus(false);
                      return Promise.reject(new Error('Not a valid email'));
                    }
                  },
                },
                {
                  required: true,
                  message: 'Please give it a email.',
                },
              ]}
            >
              <Input
                className="input"
                placeholder="Enter Email"
                suffix={
                  codeStatus ? (
                    <div className={styles.notice}>
                      Code Sent
                      <VectorIcon className="ml-1" />
                    </div>
                  ) : (
                    <div
                      className={clsx(styles.notice, {
                        [styles.allowed]: validatedEmail,
                      })}
                      onClick={handleSendCode}
                    >
                      Send a code
                    </div>
                  )
                }
              />
            </Form.Item>
            <Form.Item
              name="code"
              className="!mb-8"
              validateFirst={true}
              rules={[
                {
                  validator: (_, value) => {
                    if (value) {
                      setValidatedCode(true);
                      return Promise.resolve();
                    } else {
                      setValidatedCode(false);
                      return Promise.reject(new Error('Not a valid code'));
                    }
                  },
                },
                {
                  required: true,
                  message: 'Please give it a code.',
                },
              ]}
            >
              <Input
                className="input"
                placeholder="Enter Code"
                suffix={
                  <div className={styles.notice}>
                    {validatedCode ? (
                      <>
                        Verified
                        <VectorIcon className="ml-1" />
                      </>
                    ) : (
                      'Verify'
                    )}
                  </div>
                }
              />
            </Form.Item>
            <Form.Item
              name="password"
              className="!mb-4 formLabel"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please give it a password.',
                },
              ]}
            >
              <Input.Password className="input" placeholder="Enter Password" />
            </Form.Item>
            <Form.Item
              className="!mb-4"
              validateFirst
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!'
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                className="input"
                placeholder="Confirm Password"
              />
            </Form.Item>
          </Form>
        </div>
        <div className="flex justify-end">
          <button
            className="button-grey px-[30px] h-12 text-[20px] mt-12"
            onClick={form.submit}
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
    </div>
  );
};
export default SignUpPage;
