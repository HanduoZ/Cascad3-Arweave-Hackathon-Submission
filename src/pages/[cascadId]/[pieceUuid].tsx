import dynamic from 'next/dynamic';
import Head from 'next/head';
import { pieceDetailReq } from 'src/api/cascad/piece';

// 客户端渲染
const Layout = dynamic(() => import('src/components/Layout'), {
  ssr: false,
});

const CascadLayout = dynamic(() => import('src/components/CascadLayout'), {
  ssr: false,
});

const CascadPiece = dynamic(() => import('src/pc/cascad/CascadPiece'), {
  ssr: false,
});

interface CascadPageParams {
  cascadId: string;
  pieceUuid: string;
}

interface CascadPiecePageProps {
  detail: {
    title: string;
    logoUrl: string;
    description: string;
  };
}

const CascadPiecePage = (props: CascadPiecePageProps) => {
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
          <CascadPiece />
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
    const { cascadId, pieceUuid } = params;
    const data = await pieceDetailReq(pieceUuid, cascadId);
    const res = {
      title: data.data.data.title,
      logoUrl: data.data.data.coverUrl,
      description: data.data.data.subTitle,
    };
    return { props: { detail: res }, revalidate: 60 };
  } catch (error) {}
};

export default CascadPiecePage;
