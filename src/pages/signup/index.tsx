import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染
const Layout = dynamic(() => import('src/components/Layout'), {
  ssr: false,
});
const Signup = dynamic(() => import('src/pc/Signup'), {
  ssr: false,
});

const SignupPage = () => {
  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>
      <Layout>
        <Signup />
      </Layout>
    </>
  );
};

export default SignupPage;
/*  */
