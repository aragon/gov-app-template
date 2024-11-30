import { RootContextProvider } from "@/context";
import { Layout } from "@/components/layout";
import AlertContainer from "@/components/alert/alert-container";
import "@aragon/gov-ui-kit/index.css";
import "@/pages/globals.css";
import Head from "next/head";
import localFont from "next/font/local";

const supreme = localFont({
  src: "./fonts/Supreme-Regular.woff2",
  variable: "--guk-font-family",
});

export default function AragonetteApp({ Component, pageProps }: any) {
  return (
    <div className={`${supreme.className}`}>
      <Head>
        <title>PWN DAO Governance</title>
        <meta name="color-scheme" content="dark" />
        <meta name="author" content="PWN DAO" />
        {/* // TODO any other tags to define? */}

        <meta property="og:title" content="PWN DAO Governance" />
        <meta name="twitter:title" content="PWN DAO Governance" />
        <meta name="twitter:image" content="https://pwn.xyz/og-card.png" />
        <meta property="og:image" content="https://pwn.xyz/og-card.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@pwndao" />
        <meta name="twitter:site" content="@pwndao" />
        <meta name="description" content="Check and vote on PWN DAO proposals." />
        <meta property="og:description" content="Check and vote on PWN DAO proposals." />
        <meta name="twitter:description" content="Check and vote on PWN DAO proposals." />
        {/* // TODO what different meta tags to define? */}

        {/* TODO define schema.org? */}
      </Head>

      <RootContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <AlertContainer />
      </RootContextProvider>
    </div>
  );
}
