import { Text } from '@chakra-ui/react';

type Props = {
  message?: string;
};

export default function FormErrorText({ message }: Props) {
  if (!message) return null;

  return (
    <Text mt="1" color="red.500" fontSize="sm">
      {message}
    </Text>
  );
}