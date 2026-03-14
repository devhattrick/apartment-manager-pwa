import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import StatusPill from '../common/StatusPill';
import { getGuestById, getStatusClasses, getStatusLabel } from '../../lib/apartment';
import { useApartmentStore } from '../../store/useApartmentStore';
import { useAppStore } from '../../store/useAppStore';
import type { Contract, Room } from '../../types';

type Props = {
  room: Room | null;
  contract?: Contract;
  isOpen: boolean;
  onClose: () => void;
};

export default function RoomDetailDrawer({
  room,
  contract,
  isOpen,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const { guests } = useApartmentStore();

  if (!isOpen || !room) return null;

  const guest = contract ? getGuestById(contract.guestId, guests) : undefined;

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="50"
      bg="rgba(10, 33, 41, 0.52)"
      backdropFilter="blur(10px)"
      onClick={onClose}
    >
      <Box
        position="absolute"
        top="0"
        right="0"
        h="100%"
        w={{ base: '100%', md: '460px' }}
        bg="linear-gradient(180deg, #f7f8f6 0%, #eff4f2 100%)"
        borderLeft="1px solid rgba(15, 118, 110, 0.12)"
        boxShadow="-24px 0 48px -32px rgba(14, 62, 74, 0.36)"
        p={{ base: '5', md: '6' }}
        onClick={(e) => e.stopPropagation()}
        className="overflow-y-auto"
      >
        <Flex align="start" justify="space-between" gap="3">
          <Box>
            <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
              {t('roomList')}
            </Text>
            <Text mt="3" fontSize="3xl" fontWeight="bold" color="brandDark">
              Room {room.roomNumber}
            </Text>
            <Text mt="2" color="textMuted">
              {t('building')}: {room.building} · {t('floor')}: {room.floor}
            </Text>
          </Box>

          <Button
            size="sm"
            rounded="full"
            border="1px solid"
            borderColor="rgba(15, 118, 110, 0.14)"
            bg="rgba(255, 255, 255, 0.8)"
            color="brandDark"
            _hover={{ bg: 'white' }}
            onClick={onClose}
          >
            {t('close')}
          </Button>
        </Flex>

        <Box mt="5">
          <StatusPill
            label={getStatusLabel(room.status, language)}
            toneClassName={getStatusClasses(room.status)}
          />
        </Box>

        <Box
          mt="6"
          rounded="3xl"
          border="1px solid"
          borderColor="rgba(15, 118, 110, 0.12)"
          bg="rgba(255, 255, 255, 0.76)"
          p="5"
        >
          <Flex direction="column" gap="3.5">
            <Flex align="center" justify="space-between" gap="4">
              <Text color="textMuted">{t('guestName')}</Text>
              <Text fontWeight="medium" color="brandDark" textAlign="right">
                {guest ? `${guest.firstName} ${guest.lastName}` : t('noGuest')}
              </Text>
            </Flex>

            <Flex align="center" justify="space-between" gap="4">
              <Text color="textMuted">{t('stayType')}</Text>
              <Text fontWeight="medium" color="brandDark">
                {contract ? (contract.stayType === 'DAILY' ? t('daily') : t('monthly')) : '-'}
              </Text>
            </Flex>

            <Flex align="center" justify="space-between" gap="4">
              <Text color="textMuted">{t('price')}</Text>
              <Text fontWeight="medium" color="brandDark">
                {contract ? `${contract.price.toLocaleString()} THB` : '-'}
              </Text>
            </Flex>

            <Flex align="center" justify="space-between" gap="4">
              <Text color="textMuted">{t('checkIn')}</Text>
              <Text fontWeight="medium" color="brandDark">
                {contract?.checkInDate || '-'}
              </Text>
            </Flex>

            <Flex align="center" justify="space-between" gap="4">
              <Text color="textMuted">{t('checkOut')}</Text>
              <Text fontWeight="medium" color="brandDark">
                {contract?.checkOutDate || '-'}
              </Text>
            </Flex>
          </Flex>
        </Box>

        <Box
          mt="5"
          rounded="3xl"
          border="1px solid"
          borderColor="rgba(15, 118, 110, 0.12)"
          bg="rgba(255, 255, 255, 0.76)"
          p="5"
        >
          <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
            {t('roomStatus')}
          </Text>

          <Flex direction="column" gap="3.5" mt="4">
            <Flex align="center" justify="space-between" gap="4">
              <Text color="textMuted">{t('roomType')}</Text>
              <Text fontWeight="medium" color="brandDark">
                {room.roomType || '-'}
              </Text>
            </Flex>

            <Flex align="center" justify="space-between" gap="4">
              <Text color="textMuted">{t('defaultDaily')}</Text>
              <Text fontWeight="medium" color="brandDark">
                {room.defaultDailyPrice?.toLocaleString() || '-'} THB
              </Text>
            </Flex>

            <Flex align="center" justify="space-between" gap="4">
              <Text color="textMuted">{t('defaultMonthly')}</Text>
              <Text fontWeight="medium" color="brandDark">
                {room.defaultMonthlyPrice?.toLocaleString() || '-'} THB
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
