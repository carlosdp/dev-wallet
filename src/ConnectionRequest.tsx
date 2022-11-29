import { Button } from "./Button";

export type ConnectionRequestProps = {
  onConfirm: () => void;
  onReject: () => void;
};

export const ConnectionRequest = ({ onConfirm, onReject }: ConnectionRequestProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '7px 5px 37px -1px rgba(41,40,40,0.75)' }}>
      <div>Connection Request</div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
        <Button onClick={onConfirm}>Allow</Button>
        <Button onClick={onReject}>Reject</Button>
      </div>
    </div>
  );
};