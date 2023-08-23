import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染
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
      <CascadLayout>
        <PersonalCenter />
      </CascadLayout>
    </>
  );
};
export default PersonalCenterPage;
