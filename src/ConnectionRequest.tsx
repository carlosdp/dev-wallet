import {  Button, Heading, Card, CardHeader, CardFooter } from '@chakra-ui/react';

export type ConnectionRequestProps = {
  onConfirm: () => void;
  onReject: () => void;
};

export const ConnectionRequest = ({ onConfirm, onReject }: ConnectionRequestProps) => {
  return (
    <Card>
      <CardHeader>
        <Heading size='md'>Connection Request</Heading>
      </CardHeader>
      <CardFooter display='flex' flexDirection='row' gap='12px'>
        <Button onClick={onConfirm}>Allow</Button>
        <Button onClick={onReject}>Reject</Button>
      </CardFooter>
    </Card>
  );
};