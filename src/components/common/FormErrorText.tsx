import { Text } from '@chakra-ui/react';

type Props = {
  message?: string;
};

export default function FormErrorText({ message }: Props) {
  if (!message) return null;

  return (
    <Text mt="2" color="#B42318" fontSize="sm" fontWeight="medium">
      {message}
    </Text>
  );
}
