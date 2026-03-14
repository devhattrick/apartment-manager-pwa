import { Box, Heading, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  description?: string;
};

export default function PlaceholderPage({ title, description }: Props) {
  return (
    <Box
      bg="white"
      rounded="2xl"
      p="6"
      border="1px solid"
      borderColor="borderSubtle"
      shadow="sm"
    >
      <Heading size="md" color="brandDark">
        {title}
      </Heading>
      <Text mt="2" color="textMuted">
        {description || 'Coming soon'}
      </Text>
    </Box>
  );
}