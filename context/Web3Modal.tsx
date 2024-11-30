import { Config, http } from "wagmi";
import { ENABLED_CHAINS, PUB_RPC_URL, PUB_WALLET_CONNECT_PROJECT_ID } from "@/constants";
import { ChainId } from "@/utils/chains";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { AppKitNetwork } from "@reown/appkit/networks";

export const wagmiAdapter = new WagmiAdapter({
  networks: ENABLED_CHAINS,
  // TODO do we need to have this enabled?
  ssr: true,
  transports: {
    [1]: http(PUB_RPC_URL[1], { batch: true }),
    [11155111]: http(PUB_RPC_URL[11155111], { batch: true }),
  } satisfies Record<ChainId, unknown>,
  projectId: PUB_WALLET_CONNECT_PROJECT_ID,
});

export const config = wagmiAdapter.wagmiConfig as Config;
