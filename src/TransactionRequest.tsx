import { ethers } from "ethers";

export type TransactionRequestProps = {
  tx: ethers.providers.TransactionRequest;
  onConfirm: () => void;
  onReject: () => void;
};

export const TransactionRequest = ({ tx, onConfirm, onReject }: TransactionRequestProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '7px 5px 37px -1px rgba(41,40,40,0.75)' }}>
      <div>Transaction Request</div>
      <div>
        <div>
          <span>Value</span>
          <span>{tx.value ? ethers.utils.formatEther(tx.value) : '0'} ETH</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onReject}>Reject</button>
      </div>
    </div>
  );
};