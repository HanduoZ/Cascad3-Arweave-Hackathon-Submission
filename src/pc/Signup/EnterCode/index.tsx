import { useState } from 'react';
import { getVerificationCodeReq, registerReq } from 'src/api/user';
import CodeBox from './CodeBox';
import { message } from 'antd';
import { TOKEN } from 'src/utils/statics';
import useUserInfo from 'src/hooks/use-user-info';

const EnterCode = (props: any) => {
  const { email, username, password, walletAddress, changeStep } = props;
  const [validatedCode, setValidatedCode] = useState(true);

  const { mutate: mutateUserInfo } = useUserInfo();
  const [commitLoading, setCommitLoading] = useState(false);
  const [sendCode, setSendCode] = useState(false);

  const [code, setCode] = useState('');
  // 输入 验证码
  const onChange = (val: any) => {
    // console.log('val:', val);
    setCode('');
  };
  const onComplete = (val: any) => {
    // console.log('val:', val);
    setCode(val);
    setValidatedCode(true);
  };

  /** get code */
  const handleSendCode = async () => {
    try {
      const res = await getVerificationCodeReq({
        codeType: 0,
        email: email.trim(),
      });
      if (res.data.status === 1) {
        setSendCode(true);
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };
  /** create Account */
  const createAccount = async () => {
    try {
      console.log('code', code);
      if (code.length < 6) {
        setValidatedCode(false);
        return;
      }

      setCommitLoading(true);

      const res = await registerReq({
        code: code.trim(),
        email: email.trim(),
        username: username?.trim(),
        walletAddress: walletAddress?.trim(),
        password: password,
      });
      console.log('res', res);
      if (res.data.status === 1) {
        // 创建成功自动登录
        localStorage.setItem(TOKEN, res.data.data);
        mutateUserInfo();

        changeStep(3);
      } else if (res.data.status === 2000) {
        // 验证码错误
        setValidatedCode(false);
      }
      setCommitLoading(false);
    } catch (error) {
      // setValidatedCode(false);
      if ((error as any).code === 2000 || (error as any).code === 2001) {
        // 验证码错误
        setValidatedCode(false);
      }
      console.log((error as any).code);
      // message.error((error as Error).message);
      setCommitLoading(false);
    }
  };
  return (
    <div>
      <div className="h-[500px]">
        <div className="flex flex-col items-center justify-center ">
          <div className="flex flex-col items-center mb-[40px]">
            <div className="text-[38px] leading-[46px] h-[58px] font-medium text-first">
              Enter verification code
            </div>
          </div>
          <div className="flex flex-col items-center">
            {sendCode && (
              <div className="text-[20px] leading-[30px] h-[40px] text-center font-[500]  mt-4 text-first text-first">
                Email was resent!
              </div>
            )}
            <div className="text-[20px] leading-[30px] h-[58px]   text-first">
              We’ve sent a code to {email}
            </div>
          </div>
          <div>
            <div className="mt-4 h-[120px]">
              <CodeBox onCodeChange={onChange} onCodeComplete={onComplete} />
              {!validatedCode && (
                <div className="text-[16px] leading-[30px] h-[40px] text-center font-semibold  mt-4 text-first !text-[#833B3B]">
                  Invalid code, please try again.
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center mb-[40px] w-[420px] mt-6">
            <div className="text-[20px] text-center leading-[30px] h-[58px]   text-first">
              Didn’t get the code? Please check your spam folder or
              <span
                className="inline ml-2 cursor-pointer  line-clamp-1 underline"
                onClick={(e) => {
                  handleSendCode();
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                click to resend.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col items-center"> */}
      <div className=" flex justify-end">
        <button
          className="button-white !justify-center !p-[8px_30px] !h-[40px] w-[130px] !text-[16px] mt-12 "
          onClick={(e) => {
            e.preventDefault();
            changeStep(1);
          }}
        >
          Cancel
        </button>

        <button
          className="button-green !p-[8px_34px] !justify-center w-[130px] !h-[40px] !text-[16px] mt-12 ml-[25px]"
          onClick={(e) => {
            createAccount();
          }}
        >
          {commitLoading && (
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
          )}
          Verify
        </button>
      </div>
    </div>
    // </div>
  );
};
export default EnterCode;
