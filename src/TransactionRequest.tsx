import { ethers } from "ethers";
import { Box, Button, Text, Heading, Card, CardHeader, CardBody, CardFooter, Stack, StackDivider } from '@chakra-ui/react';

export type TransactionRequestProps = {
  tx: ethers.providers.TransactionRequest;
  onConfirm: () => void;
  onReject: () => void;
};

export const TransactionRequest = ({ tx, onConfirm, onReject }: TransactionRequestProps) => {
  return (
    <Card>
      <CardHeader>
        <Heading size='md'>Transaction Request</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={4}>
          <Box>
            <Heading size='sx' textTransform='uppercase'>To</Heading>
            <Text paddingTop={2} fontSize='sm'>{tx.to}</Text>
          </Box>
          <Box>
            <Heading size='sx' textTransform='uppercase'>Value</Heading>
            <Text paddingTop={2} fontSize='sm'>{tx.value ? ethers.utils.formatEther(tx.value) : '0'} ETH</Text>
          </Box>
          <Box>
            <Heading size='sx' textTransform='uppercase'>Transaction Type</Heading>
            <Text paddingTop={2} fontSize='sm'>{!!tx.data ? 'Contract Call' : 'Value Send'}</Text>
          </Box>
        </Stack>
      </CardBody>
      <CardFooter display='flex' flexDirection='row' gap='12px'>
        <Button colorScheme='blue' onClick={onConfirm}>Confirm</Button>
        <Button colorScheme='red' onClick={onReject}>Reject</Button>
      </CardFooter>
    </Card>
  );
};