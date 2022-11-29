import type { DevWallet } from "./DevWallet";

declare global {
  interface Window {
    ethereum?: DevWallet;
  }
}