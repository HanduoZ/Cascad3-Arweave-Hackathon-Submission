import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from 'src/components/Layout';

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
      <Layout>
        <Login />
      </Layout>
    </>
  );
};

export default LoginPage;
