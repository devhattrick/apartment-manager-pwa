import { Box, Heading, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  description?: string;
};

export default function PlaceholderPage({ title, description }: Props) {
  return (
    <Box
      bg="rgba(255, 255, 255, 0.82)"
      rounded="3xl"
      p={{ base: '5', md: '6' }}
      border="1px solid"
      borderColor="rgba(15, 118, 110, 0.12)"
      boxShadow="panel"
      backdropFilter="blur(16px)"
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
