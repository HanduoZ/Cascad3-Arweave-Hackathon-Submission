import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700,800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Maven Pro:400,500,600,700,800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Julius Sans One:400,500,600,700,800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <style
          id="holderStyle"
          dangerouslySetInnerHTML={{
            __html: `
              *, *::before, *::after {
                transition: none!important;
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if (typeof window !== "undefined") {
            window.onload = () => {
              document.getElementById("holderStyle").remove();
            };
          }})()`,
          }}
        />
      </body>
    </Html>
  );
}
