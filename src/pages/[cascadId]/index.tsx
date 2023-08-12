import dynamic from 'next/dynamic';
import Head from 'next/head';
import { cascadeInfoReq } from 'src/api/cascad';

// 客户端渲染
const Layout = dynamic(() => import('src/components/Layout'), {
  ssr: false,
});

const CascadLayout = dynamic(() => import('src/components/CascadLayout'), {
  ssr: false,
});

const CascadPieceIndex = dynamic(
  () => import('src/pc/cascad/CascadPieceIndex'),
  {
    ssr: false,
  }
);

interface CascadPageParams {
  cascadId: string;
}

interface CascadPiecePageProps {
  detail: {
    title: string;
    logoUrl: string;
    description: string;
  };
}

const CascadPage = (props: CascadPiecePageProps) => {
  const { detail } = props;
  return (
    <>
      <Head>
        <title>{detail?.title}</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@BabelUniverse" />
        <meta property="og:title" content={detail?.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={detail?.logoUrl} />
        <meta property="og:description" content={detail?.description} />
      </Head>
      <Layout>
        <CascadLayout>
          <CascadPieceIndex />
        </CascadLayout>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export const getStaticProps = async ({
  params,
}: {
  params: CascadPageParams;
}) => {
  try {
    const { cascadId } = params;
    const data = await cascadeInfoReq(cascadId);
    const res = {
      title: data.data.data.name,
      logoUrl: data.data.data.logoUrl,
      description: data.data.data.description,
    };
    return { props: { detail: res }, revalidate: 60 };
  } catch (error) {}
};

export default CascadPage;
