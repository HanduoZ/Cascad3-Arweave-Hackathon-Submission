import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染
const Signup = dynamic(() => import('src/pc/Signup'), {
  ssr: false,
});

const SignupPage = () => {
  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>
      <Signup />
    </>
  );
};

export default SignupPage;
