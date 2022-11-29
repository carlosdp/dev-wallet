import { ethers } from 'ethers';

// The default first account in a Hard Hat node
const DEFAULT_PRIVATE_KEY='0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

export interface DevWalletOptions {
  /**
   * Skip manual authorization of wallet connect and signing requests.
   *
   * @default false
   */
  skipAuthorization?: boolean;
  /**
   * The private key to use for signing.
   */
  privateKey?: string;
}

export interface DevWalletDeferredResponse {
  accept: () => void;
  deny: () => void;
}

export type WalletEventHandlers = {
  connect: ((_e: DevWalletDeferredResponse) => void)[];
  sendTransaction: ((_e: DevWalletDeferredResponse, _tx: ethers.providers.TransactionRequest) => void)[];
  signMessage: ((_e: DevWalletDeferredResponse, _message: ethers.utils.BytesLike) => void)[];
};

export class DevWallet implements ethers.providers.ExternalProvider {
  baseProvider: ethers.providers.JsonRpcProvider;
  wallet: ethers.Wallet;
  skipAuthorization: boolean;
  connectionAuthorized: boolean;
  waitingConnectRequests: DevWalletDeferredResponse[];
  waitingTransactionRequests: DevWalletDeferredResponse[];
  waitingSigningRequests: DevWalletDeferredResponse[];
  eventHandlers: WalletEventHandlers;

  constructor(provider: ethers.providers.JsonRpcProvider, options?: DevWalletOptions) {
    this.wallet = new ethers.Wallet(options?.privateKey ?? DEFAULT_PRIVATE_KEY, provider);
    this.baseProvider = provider;
    this.skipAuthorization = options?.skipAuthorization || false;
    this.connectionAuthorized = window.localStorage.getItem('devWallet_connectAuthorized') === 'true' || !!this.skipAuthorization;

    this.waitingConnectRequests = [];
    this.waitingTransactionRequests = [];
    this.waitingSigningRequests = [];
    this.eventHandlers = {
      connect: [],
      sendTransaction: [],
      signMessage: [],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request(req: { method: string; params?: any[] }) {
    switch (req.method) {
      case 'eth_requestAccounts':
      case 'eth_accounts': {
        if (!this.skipAuthorization && !this.connectionAuthorized) {
          let accept = null as unknown as () => void;
          let deny = null as unknown as () => void;

          const promise = new Promise((resolve, reject) => {
            accept = resolve as () => void;
            deny = reject as () => void;
          });

          const defResponse = { accept, deny };

          this.waitingConnectRequests.push(defResponse);

          this.emit('connect', defResponse);

          await promise;
        }

        return [await this.wallet.getAddress()];
      }
      case 'personal_sign':
        if (!req.params || req.params.length === 0) {
          throw new Error('no message provided for personal_sign');
        }

        if (!this.skipAuthorization) {
          let accept = null as unknown as () => void;
          let deny = null as unknown as () => void;

          const promise = new Promise((resolve, reject) => {
            accept = resolve as () => void;
            deny = reject as () => void;
          });

          const defResponse = { accept, deny };

          this.waitingSigningRequests.push(defResponse);

          this.emit('signMessage', defResponse, req.params[0]);

          await promise;
        }

        return this.wallet.signMessage(req.params[0]);
      case 'eth_sendTransaction': {
        if (!req.params || req.params.length === 0) {
          throw new Error('no transaction provided for eth_sendTransaction');
        }

        if (!this.skipAuthorization) {
          let accept = null as unknown as () => void;
          let deny = null as unknown as () => void;

          const promise = new Promise((resolve, reject) => {
            accept = resolve as () => void;
            deny = reject as () => void;
          });

          const defResponse = { accept, deny };

          this.waitingTransactionRequests.push(defResponse);

          this.emit('sendTransaction', defResponse, req.params[0]);

          await promise;
        }

        delete req.params[0]['gas'];
        return this.wallet.sendTransaction(req.params[0]);
      }
      case 'eth_decrypt': {
        throw new Error('eth_decrypt not implemented');
      }
      default:
        return this.baseProvider.send(req.method, req.params || []);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendAsync(req: { method: string; params?: any[] }, callback: (error: any, response: any) => void) {
    this.request(req)
      // eslint-disable-next-line promise/no-callback-in-promise
      .then(r => setTimeout(() => callback(null, r), 0))
      // eslint-disable-next-line promise/no-callback-in-promise
      .catch(error => setTimeout(() => callback(error, null), 0));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(req: { method: string; params?: any[] }, callback: (error: any, response: any) => void) {
    this.sendAsync(req, callback);
  }

  authorizeConnect() {
    this.connectionAuthorized = true;
    window.localStorage.setItem('devWallet_connectAuthorized', 'true');

    for (const request of this.waitingConnectRequests) {
      request.accept();
    }

    this.waitingConnectRequests = [];
  }

  denyConnect() {
    window.localStorage.removeItem('devWallet_connectAuthorized');

    for (const request of this.waitingConnectRequests) {
      request.deny();
    }

    this.waitingConnectRequests = [];
  }

  authorizeTransaction(req: DevWalletDeferredResponse) {
    const i = this.waitingTransactionRequests.indexOf(req);

    if (i !== -1) {
      this.waitingTransactionRequests.splice(i, 1);
      req.accept();
    }
  }

  denyTransaction(req: DevWalletDeferredResponse) {
    const i = this.waitingTransactionRequests.indexOf(req);

    if (i !== -1) {
      this.waitingTransactionRequests.splice(i, 1);
      req.deny();
    }
  }

  authorizeSigning(req: DevWalletDeferredResponse) {
    const i = this.waitingSigningRequests.indexOf(req);

    if (i !== -1) {
      this.waitingSigningRequests.splice(i, 1);
      req.accept();
    }
  }

  denySigning(req: DevWalletDeferredResponse) {
    const i = this.waitingSigningRequests.indexOf(req);

    if (i !== -1) {
      this.waitingSigningRequests.splice(i, 1);
      req.deny();
    }
  }

  addEventListener<T extends keyof WalletEventHandlers>(event: T, handler: WalletEventHandlers[T][number]) {
    this.eventHandlers[event].push(handler as any);
  }

  removeEventListener<T extends keyof WalletEventHandlers>(event: T, handler: WalletEventHandlers[T][number]) {
    const index = this.eventHandlers[event].indexOf(handler as any);

    if (index !== -1) {
      this.eventHandlers[event].splice(index, 1);
    }
  }

  private emit<T extends keyof WalletEventHandlers>(event: T, ...args: Parameters<WalletEventHandlers[T][number]>) {
    for (const handler of this.eventHandlers[event]) {
      // @ts-ignore
      handler(...args);
    }
  }

  on<T extends keyof WalletEventHandlers>(event: T, handler: WalletEventHandlers[T][number]) {
    if (!this.eventHandlers[event]) {
      return;
    }

    this.addEventListener(event, handler);
  }
}