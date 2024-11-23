import { RootContextProvider } from "@/context";
import { Layout } from "@/components/layout";
import AlertContainer from "@/components/alert/alert-container";
import "@aragon/gov-ui-kit/index.css";
import "@/pages/globals.css";
import { PUB_APP_NAME } from "@/constants";
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
        <title>{PUB_APP_NAME}</title>
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
