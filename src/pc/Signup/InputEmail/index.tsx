import { useState } from 'react';
import { md5Pwd, validateEmail } from 'src/utils/common';
import { Form, Input, message } from 'antd';
import {
  getVerificationCodeReq,
  checkEmailExistReq,
  checkUsernameExistReq,
} from 'src/api/user';
import { useRouter } from 'next/router';

const InputEmail = (props: any) => {
  const { changeStep } = props;

  const router = useRouter();
  const [form] = Form.useForm();

  const [codeLoading, setCodeLoading] = useState(false);
  // 设置当前步骤
  // const [step, setStep] = useState(1);
  // true 邮箱已经注册
  const [validatedEmail, setValidatedEmail] = useState(false);
  const [validatedUsername, setValidatedUsername] = useState(false);

  const emailValue = Form.useWatch('email', form);
  const usernameValue = Form.useWatch('username', form);
  // 检测用户名是否已经使用
  const checkEmailFunc = async () => {
    if (emailValue) {
      const checkEmailRes = await checkEmailExistReq({
        email: emailValue.trim(),
      });
      if (checkEmailRes.data.data) {
        setValidatedEmail(true);
      } else {
        setValidatedEmail(false);
      }
    }
  };
  // 检测用户名是否已经使用
  const checkUsernameFunc = async () => {
    if (usernameValue) {
      const checkUsernameRes = await checkUsernameExistReq({
        username: usernameValue,
      });
      if (checkUsernameRes.data.data) {
        setValidatedUsername(true);
      } else {
        setValidatedUsername(false);
      }
    }
  };

  /** get code */
  const handleSendCode = async (values: any) => {
    try {
      setCodeLoading(true);
      // 检测邮箱是否存在
      const checkEmailRes = await checkEmailExistReq({
        email: emailValue.trim(),
      });

      if (checkEmailRes.data.data) {
        setValidatedEmail(true);
        setCodeLoading(false);
        return;
      } else {
        setValidatedEmail(false);
      }

      if (usernameValue) {
        const checkUsernameRes = await checkUsernameExistReq({
          username: usernameValue,
        });
        if (checkUsernameRes.data.data) {
          setValidatedUsername(true);
          setCodeLoading(false);

          return;
        } else {
          setValidatedUsername(false);
        }
      }

      const res = await getVerificationCodeReq({
        codeType: 0,
        email: emailValue.trim(),
      });
      if (res.data.status === 1) {
        let signProps = {
          step: 2,
          email: values.email,
          username: values.username,
          password: md5Pwd(values.password),
          walletAddress: '',
          changeStep: changeStep,
        };
        changeStep(2, signProps);
      }
      setCodeLoading(false);
    } catch (error) {
      message.error((error as Error).message);
      setCodeLoading(false);
    }
  };

  return (
    <div>
      <div className="">
        <div className="h-[500px]">
          <div className="flex flex-col items-center   mb-[40px]">
            <div className="text-[38px] leading-[46px] h-[58px] font-medium text-first">
              Create your account
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Form
              form={form}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={handleSendCode}
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
                        return Promise.resolve();
                      } else {
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
                  onBlur={checkEmailFunc}
                />
              </Form.Item>
              {validatedEmail && (
                <div className="text-[16px] leading-[30px] h-[40px]  font-semibold  mt-4 text-first !text-[#833B3B]">
                  Email is invalid or already taken
                </div>
              )}
              <Form.Item
                name="username"
                className="!mb-4 formLabel"
                label="User Name"
                // validateFirst={false}
                // rules={[
                //   {
                //     validator: (_, value) => {
                //       if (validateEmail(value)) {
                //         setValidatedEmail(true);
                //         setCodeStatus(false);
                //         return Promise.resolve();
                //       } else {
                //         setValidatedEmail(false);
                //         setCodeStatus(false);
                //         return Promise.reject(new Error('Not a valid email'));
                //       }
                //     },
                //   },
                //   {
                //     required: false,
                //     message: 'Please give it a email.',
                //   },
                // ]}
              >
                <Input
                  className="input"
                  placeholder="Enter a unique name"
                  autoComplete="off"
                  onFocus={(e) => {
                    console.log('onFocus', e.target.value);
                  }}
                  onBlur={checkUsernameFunc}
                />
              </Form.Item>
              {validatedUsername && (
                <div className="text-[16px] leading-[30px] h-[40px]  font-semibold  mt-4 text-first !text-[#833B3B]">
                  Username is already taken
                </div>
              )}
              <Form.Item
                name="password"
                className="!mb-4 formLabel "
                label="Password"
                rules={[
                  {
                    required: true,
                    message: 'Please give it a password.',
                  },
                ]}
              >
                <Input.Password
                  className="input"
                  placeholder="Enter Password"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                className="!mb-4"
                validateFirst
                name="confirmpassword"
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
                  autoComplete="new-password"
                />
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="flex justify-end mb-0">
          <button
            className="button-white !justify-center !p-[8px_30px] !h-[40px] w-[130px] !text-[16px] mt-12 "
            onClick={(e) => {
              e.preventDefault();
              router.back();
              // changeStep(1);
            }}
          >
            Cancel
          </button>

          <button
            className={
              'button-green !p-[8px_0px] !justify-center w-[130px] !h-[40px] text-center !text-[16px] mt-12 ml-[25px]'
            }
            onClick={form.submit}
          >
            {codeLoading && (
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
            )}
            {`Sign Up`}
          </button>
        </div>
      </div>
    </div>
  );
};
export default InputEmail;
