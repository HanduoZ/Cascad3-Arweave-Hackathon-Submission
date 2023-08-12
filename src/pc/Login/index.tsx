import { useState } from 'react';
import { loginReq } from 'src/api/user';
import styles from './index.module.less';
import { md5Pwd } from 'src/utils/common';
import { TOKEN } from 'src/utils/statics';
import { Form, Input, message } from 'antd';
import useUserInfo from 'src/hooks/use-user-info';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const router = useRouter();
  const CBUrl = router.query.cburl as string;

  const [form] = Form.useForm();
  const [commitLoading, setCommitLoading] = useState(false);
  const { mutate: mutateUserInfo } = useUserInfo();

  const handleLogin = async (values: any) => {
    try {
      if (commitLoading) return;
      setCommitLoading(true);
      const res = await loginReq({
        username: values.email.trim(),
        password: md5Pwd(values.password),
      });
      if (res.data.status === 1) {
        message.success('Success!');
        localStorage.setItem(TOKEN, res.data.data);
        mutateUserInfo();
        if (CBUrl) {
          router.push(CBUrl);
        } else {
          router.push('/');
        }
      }
      setCommitLoading(false);
    } catch (error) {
      message.error((error as Error).message);
      setCommitLoading(false);
    }
  };
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="text-[38px] leading-[46px] h-[58px] font-medium text-first">
          You account is created
        </div>
        <div className="text-first text-[25px] leading-[34px] font-medium h-[58px] mt-8">
          Log in
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Form
          form={form}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
          autoComplete="off"
          colon={false}
        >
          <Form.Item
            name="email"
            className="!mb-[20px] formLabel"
            label="Email Address"
            validateFirst={true}
            rules={[
              { type: 'email' },
              {
                required: true,
                message: 'Please give it a email.',
              },
            ]}
          >
            <Input className="input" placeholder="Enter Email" />
          </Form.Item>
          <Form.Item
            name="password"
            className="!mb-[30px] formLabel"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password className="input" placeholder="Enter Password" />
          </Form.Item>
        </Form>
        <div>
          <div style={{ marginTop: 16 }}>
            <div className={styles.mineBtn} onClick={form.submit}>
              {commitLoading && (
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
              )}
              Log In
            </div>
          </div>

          <div className={styles.forget} onClick={() => router.push('/forget')}>
            Forgot password?
          </div>
          <div className={styles.divider}></div>
          <div
            className={styles.mineBtnYellow}
            onClick={() => router.push('/signup')}
          >
            Create new account
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
