import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染
const CascadLayout = dynamic(() => import('src/components/CascadLayout'), {
  ssr: false,
});

const Writing = dynamic(() => import('src/pc/cascad/Writing'), {
  ssr: false,
});

const CascadWritingPage = () => {
  return (
    <>
      <Head>
        <title>Writing</title>
      </Head>
      <CascadLayout>
        <Writing />
      </CascadLayout>
    </>
  );
};
export default CascadWritingPage;
