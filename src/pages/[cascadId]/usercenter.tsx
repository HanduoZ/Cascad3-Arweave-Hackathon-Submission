import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染

const CascadLayout = dynamic(() => import('src/components/CascadLayout'), {
  ssr: false,
});

const UserCenter = dynamic(() => import('src/pc/cascad/UserCenter'), {
  ssr: false,
});

const UserCenterPage = () => {
  return (
    <>
      <Head>
        <title>UserCenter</title>
      </Head>
      <CascadLayout>
        <UserCenter />
      </CascadLayout>
    </>
  );
};
export default UserCenterPage;
