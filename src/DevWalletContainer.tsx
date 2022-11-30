import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { Box } from '@chakra-ui/react';
import { ConnectionRequest } from "./ConnectionRequest";
import { DevWallet, DevWalletDeferredResponse } from "./DevWallet";
import { TransactionRequest } from "./TransactionRequest";

export type DevWalletContainerProps = {
  wallet: DevWallet;
};

export const DevWalletContainer = ({ wallet }: DevWalletContainerProps) => {
  const [pendingConnectRequest, setPendingConnectRequest] = useState<boolean>(false);
  const [pendingTransactions, setPendingTransactions] = useState<{ response: DevWalletDeferredResponse, tx: ethers.providers.TransactionRequest }[]>([]);

  useEffect(() => {
    const onConnect = (e: DevWalletDeferredResponse) => {
      setPendingConnectRequest(true);
    };

    const onSendTransaction = (e: DevWalletDeferredResponse, tx: ethers.providers.TransactionRequest) => {
      setPendingTransactions((prev) => [...prev, { response: e, tx }]);
    };

    wallet.addEventListener('connect', onConnect);
    wallet.addEventListener('sendTransaction', onSendTransaction);

    // @ts-ignore
    setPendingConnectRequest(window.ethereum.waitingConnectRequests.length > 0);

    return () => {
      wallet.removeEventListener('connect', onConnect);
      wallet.removeEventListener('sendTransaction', onSendTransaction);
    };
  });

  const confirmConnection = useCallback(() => {
    if (pendingConnectRequest) {
      // @ts-ignore
      window.ethereum.authorizeConnect();
      setPendingConnectRequest(false);
    }
  }, [pendingConnectRequest]);

  const rejectConnection = useCallback(() => {
    if (pendingConnectRequest) {
      // @ts-ignore
      window.ethereum.denyConnect();
      setPendingConnectRequest(false);
    }
  }, [pendingConnectRequest]);

  const acceptRequest = useCallback((i: number) => {
    const request = pendingTransactions[i];
    if (request) {
      request.response.accept();
      setPendingTransactions((prev) => prev.filter((_, j) => j !== i));
    }
  }, [pendingTransactions]);

  const rejectRequest = useCallback((i: number) => {
    const request = pendingTransactions[i];
    if (request) {
      request.response.deny();
      setPendingTransactions((prev) => prev.filter((_, j) => j !== i));
    }
  }, [pendingTransactions]);

  return (
    <Box display={pendingConnectRequest || pendingTransactions.length > 0 ? 'block' : 'none'} position='fixed' top='20px' right='20px' width='300px' fontFamily='body' zIndex='2147483647'>
      {pendingConnectRequest && (<ConnectionRequest onConfirm={confirmConnection} onReject={rejectConnection} />)}
      {pendingTransactions.map(({ tx }, i) => (
        <TransactionRequest key={i} tx={tx} onConfirm={() => acceptRequest(i)} onReject={() => rejectRequest(i)} />
      ))}
    </Box>
  );
};