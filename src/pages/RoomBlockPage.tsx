import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import StatusPill from '../components/common/StatusPill';
import {
  getActiveContractByRoomId,
  getGuestById,
  getStatusClasses,
  getStatusLabel,
  groupRoomsByFloor,
} from '../lib/apartment';
import { useApartmentStore } from '../store/useApartmentStore';
import { useAppStore } from '../store/useAppStore';

export default function RoomBlockPage() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const { rooms, guests, contracts, seedMockData } = useApartmentStore();

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  const roomGroups = groupRoomsByFloor(rooms);
  const sortedFloors = Object.keys(roomGroups)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Box>
      <Heading size="lg" color="brandDark">
        {t('blockViewTitle')}
      </Heading>
      <Text mt="2" color="textMuted">
        {t('roomOverviewHint')}
      </Text>

      <Flex direction="column" gap="5" mt="6">
        {sortedFloors.map((floor) => (
          <Box
            key={floor}
            bg="rgba(255, 255, 255, 0.82)"
            rounded="3xl"
            border="1px solid"
            borderColor="rgba(15, 118, 110, 0.12)"
            boxShadow="panel"
            backdropFilter="blur(16px)"
            p={{ base: '5', md: '6' }}
          >
            <Flex align="center" justify="space-between" gap="3" wrap="wrap" mb="4">
              <Box>
                <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
                  {t('building')}
                </Text>
                <Text mt="2" fontSize="2xl" fontWeight="bold" color="brandDark">
                  {t('floor')} {floor}
                </Text>
              </Box>
              <Text color="textMuted">
                {roomGroups[floor].length} {t('rooms')}
              </Text>
            </Flex>

            <Grid
              templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
              gap="4"
            >
              {roomGroups[floor].map((room) => {
                const contract = getActiveContractByRoomId(room.id, contracts);
                const guest = getGuestById(contract?.guestId, guests);

                return (
                  <Box
                    key={room.id}
                    rounded="3xl"
                    border="1px solid"
                    borderColor="rgba(15, 118, 110, 0.12)"
                    bg="surfaceMuted"
                    p="4"
                  >
                    <Flex align="start" justify="space-between" gap="3">
                      <Box>
                        <Text fontSize="2xl" fontWeight="bold" color="brandDark" lineHeight="1">
                          {room.roomNumber}
                        </Text>
                        <Text mt="2" fontSize="sm" color="textMuted">
                          {room.roomType || '-'}
                        </Text>
                      </Box>
                      <StatusPill
                        label={getStatusLabel(room.status, language)}
                        toneClassName={getStatusClasses(room.status)}
                        size="xs"
                      />
                    </Flex>

                    <Flex direction="column" gap="2.5" mt="4">
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" letterSpacing="0.08em" textTransform="uppercase" color="textMuted">
                          {t('guestName')}
                        </Text>
                        <Text mt="1" fontSize="sm" color="brandDark">
                          {guest ? `${guest.firstName} ${guest.lastName}` : t('noGuest')}
                        </Text>
                      </Box>

                      <Box>
                        <Text fontSize="xs" fontWeight="bold" letterSpacing="0.08em" textTransform="uppercase" color="textMuted">
                          {t('roomStatus')}
                        </Text>
                        <Text mt="1" fontSize="sm" color="brandDark">
                          {contract
                            ? `${contract.checkInDate} - ${contract.checkOutDate}`
                            : '-'}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </Grid>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
