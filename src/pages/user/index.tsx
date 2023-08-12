import Head from 'next/head';
import dynamic from 'next/dynamic';

// 客户端渲染
const Layout = dynamic(() => import('src/components/Layout'), {
  ssr: false,
});

const User = dynamic(() => import('src/pc/User'), {
  ssr: false,
});

const AccountPage = () => {
  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      <Layout>
        <User />
      </Layout>
    </>
  );
};

export default AccountPage;
