import { ethers } from "ethers";
import { createRoot } from 'react-dom/client';
import { DevWallet, DevWalletOptions } from "./DevWallet";
import { DevWalletContainer } from "./DevWalletContainer";

export const intializeDevWallet = (provider: ethers.providers.JsonRpcProvider, options?: DevWalletOptions) => {
  const wallet = new DevWallet(provider, options);
  const node = document.createElement('div');
  document.body.appendChild(node);

  const root = createRoot(node);
  root.render(
    <DevWalletContainer wallet={wallet} />
  );

  // @ts-ignore
  window.ethereum = wallet;

  return wallet;
};