import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染
const Login = dynamic(() => import('src/pc/Login'), {
  ssr: false,
});

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Login />
    </>
  );
};

export default LoginPage;
