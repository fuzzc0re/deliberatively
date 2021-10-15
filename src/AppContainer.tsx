import { FC, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolongWallet,
  // getTorusWallet,
} from "@solana/wallet-adapter-wallets";
// import { clusterApiUrl } from "@solana/web3.js";

import { App } from "./App";

export const AppContainer: FC = () => {
  const network = WalletAdapterNetwork.Devnet; // or Testnet, Mainnet-beta

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      // getTorusWallet({
      //   options: {
      //     // TODO: Get your own tor.us wallet client Id
      //     clientId: "BOM5Cl7PXgE9Ylq1Z1tqzhpydY0RVr8k90QQ85N7AKI5QGSrr9iDC-3rvmy0K_hF0JfpLMiXoDhta68JwcxS1LQ",
      //   },
      // }),
      getLedgerWallet(),
      getSolongWallet(),
      getMathWallet(),
      getSolletWallet(),
    ],
    [network]
  );

  // const solanaEndpoint = useMemo(() => clusterApiUrl(network), [network]);
  const solanaEndpoint = "http://localhost:8899";

  return (
    <ConnectionProvider endpoint={solanaEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <App />
      </WalletProvider>
    </ConnectionProvider>
  );
};
