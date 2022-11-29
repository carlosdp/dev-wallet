import '@rainbow-me/rainbowkit/styles.css';
import { ethers } from 'ethers';
import { ConnectButton, connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { createRoot } from 'react-dom/client';

import { intializeDevWallet } from './index';

intializeDevWallet(new ethers.providers.JsonRpcProvider('/rpc'));

const { chains, provider } = configureChains(
  [chain.hardhat],
  [
    jsonRpcProvider({ rpc: () => ({ http: '/rpc' }) }),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Development',
    wallets: [injectedWallet({ chains })],
  }
])
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const Example = () => {
  return (
    <div>
      <ConnectButton />
    </div>
  )
};

const App = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Example />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export {};