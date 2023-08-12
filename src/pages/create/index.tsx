import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染
const Create = dynamic(() => import('src/pc/Create'), {
  ssr: false,
});

const CreatePage = () => {
  return (
    <>
      <Head>
        <title>CreatePage</title>
      </Head>
      <Create />
    </>
  );
};

export default CreatePage;
