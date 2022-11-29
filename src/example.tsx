import '@rainbow-me/rainbowkit/styles.css';
import { ethers } from 'ethers';
import { ConnectButton, connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import {
  chain,
  configureChains,
  createClient,
  useSendTransaction,
  useSigner,
  WagmiConfig,
} from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { createRoot } from 'react-dom/client';

import { initializeDevWallet } from './index';

initializeDevWallet(new ethers.providers.JsonRpcProvider('/rpc'));

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
  const { sendTransactionAsync } = useSendTransaction({ mode: 'prepared', request: { to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', value: ethers.BigNumber.from(100), gasLimit: ethers.BigNumber.from('100000000000000000') } });

  return (
    <div>
      <ConnectButton />
      { sendTransactionAsync && <button onClick={() => sendTransactionAsync()}>Send Transaction</button>}
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