import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { walletConnect, coinbaseWallet } from "wagmi/connectors";
import {
  PUB_APP_DESCRIPTION,
  PUB_APP_NAME,
  PUB_CHAIN,
  PUB_PROJECT_URL,
  PUB_RPC_URL,
  PUB_WALLET_CONNECT_PROJECT_ID,
  PUB_WALLET_ICON,
} from "@/constants";

// wagmi config
const metadata = {
  name: PUB_APP_NAME,
  description: PUB_APP_DESCRIPTION,
  url: PUB_PROJECT_URL,
  icons: [PUB_WALLET_ICON],
};

export const config = createConfig({
  // TODO do we need to have mainnet enabled here?
  //chains: [PUB_CHAIN, mainnet],
  chains: [PUB_CHAIN],
  ssr: true,
  transports: {
    [PUB_CHAIN.id]: http(PUB_RPC_URL, { batch: true }),
    //[mainnet.id]: http(TODO, { batch: true }),
  },
  connectors: [
    walletConnect({
      projectId: PUB_WALLET_CONNECT_PROJECT_ID,
      metadata,
      showQrModal: false,
    }),
    // coinbaseWallet({ appName: metadata.name, appLogoUrl: metadata.icons[0] }),
  ],
});
