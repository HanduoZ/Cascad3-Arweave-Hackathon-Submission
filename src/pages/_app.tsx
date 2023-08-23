import 'src/assets/css/tailwind.css';
import 'antd/dist/antd.variable.min.css';
import 'src/assets/css/global.less';
import 'src/assets/css/components.less';
import { SWRConfig } from 'swr';
import { ConfigProvider, message } from 'antd';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ErrorBoundary from 'src/pc/ErrorBoundary';
import { RecoilRoot } from 'recoil';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import UserInfoProvider from './UserInfoProvider';

dayjs.extend(relativeTime);

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
  dedupingInterval: 3000,
  // keepPreviousData: true,
};

message.config({
  maxCount: 3,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <ErrorBoundary>
        <RecoilRoot>
          <ConfigProvider>
            <SWRConfig value={swrConfig}>
              <UserInfoProvider>
                <div style={{ height: '100vh' }} className="flex flex-col">
                  <Component {...pageProps} />
                </div>
              </UserInfoProvider>
            </SWRConfig>
          </ConfigProvider>
        </RecoilRoot>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
