import { useState } from 'react';
import { findbackPswReq, getVerificationCodeReq } from 'src/api/user';
import styles from './index.module.less';
import { md5Pwd, validateEmail } from 'src/utils/common';
import { Input, message } from 'antd';
import { useRouter } from 'next/router';

const ForgetPage = () => {
  const router = useRouter();
  const CBUrl = router.query.cburl as string;

  const [data, setData] = useState<{
    email: string;
    code: string;
    password: string;
    confirmPwd: string;
  }>({
    email: '',
    code: '',
    password: '',
    confirmPwd: '',
  });
  const [commitLoading, setCommitLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [status, setStatus] = useState(0);

  const handleSendCode = async () => {
    if (!data.email) {
      message.warning('Please give it a email.');
      return;
    }
    if (!validateEmail(data.email)) {
      message.warning('Not a valid email.');
      return;
    }
    if (codeLoading) return;
    try {
      setCodeLoading(true);
      const res = await getVerificationCodeReq({
        codeType: 1,
        email: data.email.trim(),
      });
      if (res.data.status === 1) {
        message.success('Code sended');
        setStatus(1);
      }
      setCodeLoading(false);
    } catch (error) {
      message.error((error as Error).message);
      setCodeLoading(false);
    }
  };

  const checkFields = () => {
    if (!data.password) {
      message.warning('Please give it a password.');
      return false;
    }
    if (!data.confirmPwd) {
      message.warning('Please confirm password.');
      return false;
    }
    if (data.password !== data.confirmPwd) {
      message.warning(
        'The password and confirmation password are inconsistent.'
      );
      return false;
    }
    return true;
  };

  const changePwd = async () => {
    try {
      if (!checkFields()) return;
      setCommitLoading(true);
      const res = await findbackPswReq({
        code: data.code.trim(),
        password: md5Pwd(data.password),
        email: data.email.trim(),
      });
      if (res.data.status === 1) {
        message.success('Success!');
        router.push(CBUrl ? `/login?cburl=${CBUrl}` : '/login');
      }
      setCommitLoading(false);
    } catch (error: any) {
      message.error((error as Error).message);
      setCommitLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto ">
      <div className="flex flex-col items-center justify-center py-[64px]">
        {status === 0 ? (
          <>
            <div>
              <div className="text-[38px] leading-[46px] h-[58px] font-medium text-first">
                Find your account
              </div>
              <div className={styles.noticeText}>
                Please enter your email to search for your account.
              </div>
              <Input
                type="text"
                placeholder="Enter Email"
                id="forget-email"
                value={data.email}
                onChange={(e) =>
                  setData((data) => ({
                    ...data,
                    email: e.target.value,
                  }))
                }
                className={'!mt-[30px] input'}
              />
            </div>
            <div className="flex">
              <div className="button-green mt-[30px]" onClick={handleSendCode}>
                Send code
              </div>
            </div>
          </>
        ) : status === 1 ? (
          <>
            <div>
              <div className={styles.label}>Enter security code</div>
              <div className={styles.noticeText}>
                Please check your email for a message with your code. Your code
                is 6 numbers long.
              </div>
              <Input
                type="text"
                placeholder="Enter code"
                id="forget-code"
                value={data.code}
                onChange={(e) =>
                  setData((data) => ({
                    ...data,
                    code: e.target.value,
                  }))
                }
                className={'!mt-[30px] input'}
              />

              <div className={styles.noticeEmail}>
                We sent your code to:
                <div style={{ marginTop: 10 }}>n***@*******</div>
              </div>
            </div>
            <div
              className="button-green mt-[30px]"
              onClick={() =>
                data.code
                  ? setStatus(2)
                  : message.error('Please give it a code.')
              }
            >
              Continue
            </div>
            <div
              className={styles.forget}
              onClick={() => {
                message.warning('The verification code has been sent again.');
                handleSendCode();
              }}
            >
              Didn’t get a code?
            </div>
          </>
        ) : (
          <>
            <div className={styles.reset}>Reset your password</div>
            <div className={styles.label} style={{ marginTop: 20 }}>
              Password
            </div>
            <div>
              <Input.Password
                placeholder="Enter Password"
                value={data.password}
                onChange={(e) =>
                  setData((data) => ({
                    ...data,
                    password: e.target.value.trim(),
                  }))
                }
                className={'!mt-[15px] input'}
              />
            </div>
            <div>
              <Input.Password
                value={data.confirmPwd}
                id="forget-confirm-password"
                onChange={(e) =>
                  setData((data) => ({
                    ...data,
                    confirmPwd: e.target.value.trim(),
                  }))
                }
                placeholder="Confirm Password"
                className={'!mt-[15px] input'}
              />
            </div>
            <div className="button-green mt-[30px]" onClick={changePwd}>
              {commitLoading && (
                <span className="mr-1">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
              )}
              Continue
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ForgetPage;
