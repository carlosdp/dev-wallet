import { CSSProperties } from "react";

const style: CSSProperties = {
  cursor: 'pointer',
  backgroundColor: 'blue',
  borderRadius: '4px',
  padding: '12px',
  color: 'white',
};

export type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button style={style} onClick={onClick}>{children}</button>
  );
};