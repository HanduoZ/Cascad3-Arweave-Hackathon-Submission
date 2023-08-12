import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染
const Layout = dynamic(() => import('src/components/Layout'), {
  ssr: false,
});

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
      <Layout>
        <CascadLayout>
          <CascadSetting />
        </CascadLayout>
      </Layout>
    </>
  );
};
export default CascadSettingPage;
