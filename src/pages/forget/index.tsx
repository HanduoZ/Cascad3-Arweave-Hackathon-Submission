import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染
const Forget = dynamic(() => import('src/pc/Forget'), {
  ssr: false,
});

const ForgetPage = () => {
  return (
    <>
      <Head>
        <title>Forget</title>
      </Head>
      <Forget />
    </>
  );
};
export default ForgetPage;
