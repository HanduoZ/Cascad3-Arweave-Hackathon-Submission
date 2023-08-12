import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from 'src/components/Layout';

// 客户端渲染
const Home = dynamic(() => import('src/pc/Home'), {
  ssr: false,
});

const Index = () => {
  return (
    <>
      <Head>
        <title>server31</title>
      </Head>

      <Layout>
        <Home />
      </Layout>
    </>
  );
};

export default Index;
