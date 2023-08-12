import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染
const Layout = dynamic(() => import('src/components/Layout'), {
  ssr: false,
});

const CascadLayout = dynamic(() => import('src/components/CascadLayout'), {
  ssr: false,
});

const PersonalCenter = dynamic(() => import('src/pc/cascad/PersonalCenter'), {
  ssr: false,
});

const PersonalCenterPage = () => {
  return (
    <>
      <Head>
        <title>PersonalCenter</title>
      </Head>
      <Layout>
        <CascadLayout>
          <PersonalCenter />
        </CascadLayout>
      </Layout>
    </>
  );
};
export default PersonalCenterPage;
