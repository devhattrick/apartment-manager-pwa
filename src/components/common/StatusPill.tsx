import { Box } from '@chakra-ui/react';

type Props = {
  label: string;
  toneClassName: string;
  size?: 'sm' | 'xs';
};

export default function StatusPill({
  label,
  toneClassName,
  size = 'sm',
}: Props) {
  return (
    <Box
      as="span"
      className={toneClassName}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      minH={size === 'sm' ? '9' : '8'}
      px={size === 'sm' ? '4' : '3'}
      py={size === 'sm' ? '2' : '1.5'}
      rounded="full"
      border="1px solid"
      fontSize={size === 'sm' ? 'sm' : 'xs'}
      fontWeight="semibold"
      lineHeight="1"
      whiteSpace="nowrap"
    >
      {label}
    </Box>
  );
}
