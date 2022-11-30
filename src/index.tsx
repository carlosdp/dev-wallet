import { ethers } from "ethers";
import { createRoot } from 'react-dom/client';
import { DevWallet, DevWalletOptions } from "./DevWallet";
import { DevWalletContainer } from "./DevWalletContainer";
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ChakraProvider, GlobalStyle } from '@chakra-ui/react';

export const initializeDevWallet = (provider: ethers.providers.JsonRpcProvider, options?: DevWalletOptions) => {
  const wallet = new DevWallet(provider, options);
  const container = document.createElement('div');
  container.attachShadow({ mode: 'open' });
  document.body.appendChild(container);
  const node = document.createElement('div');
  node.id = 'dev-wallet';
  container.shadowRoot?.appendChild(node);

  const emotionCache = createCache({
    key: 'devwallet',
    // @ts-ignore
    container: container.shadowRoot,
  });


  const root = createRoot(node);
  root.render(
    <CacheProvider value={emotionCache}>
      <ChakraProvider>
        <DevWalletContainer wallet={wallet} />
        <GlobalStyle />
      </ChakraProvider>
    </CacheProvider>
  );

  // @ts-ignore
  window.ethereum = wallet;

  return wallet;
};