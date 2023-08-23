import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染

const CascadLayout = dynamic(() => import('src/components/CascadLayout'), {
  ssr: false,
});

const CascadSetting = dynamic(() => import('src/pc/cascad/CascadSetting'), {
  ssr: false,
});

const CascadSettingPage = () => {
  return (
    <>
      <Head>
        <title>CascadSetting</title>
      </Head>
      <CascadLayout>
        <CascadSetting />
      </CascadLayout>
    </>
  );
};
export default CascadSettingPage;
