import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import StatusPill from '../components/common/StatusPill';
import RoomDetailDrawer from '../components/room/RoomDetailDrawer';
import {
  getActiveContractByRoomId,
  getGuestById,
  getStatusClasses,
  getStatusLabel,
} from '../lib/apartment';
import { useApartmentStore } from '../store/useApartmentStore';
import { useAppStore } from '../store/useAppStore';
import type { Room, RoomStatus } from '../types';

const roomStatuses: RoomStatus[] = [
  'AVAILABLE',
  'RESERVED',
  'OCCUPIED',
  'CLEANING',
  'MAINTENANCE',
];

const statusAccentMap: Record<RoomStatus, string> = {
  AVAILABLE: '#0F766E',
  RESERVED: '#D97706',
  OCCUPIED: '#B93815',
  CLEANING: '#1E5E7A',
  MAINTENANCE: '#475467',
};

function SurfaceCard({ children }: { children: ReactNode }) {
  return (
    <Box
      bg="rgba(255, 255, 255, 0.82)"
      rounded="3xl"
      border="1px solid"
      borderColor="rgba(15, 118, 110, 0.12)"
      boxShadow="panel"
      backdropFilter="blur(16px)"
      p={{ base: '5', md: '6' }}
    >
      {children}
    </Box>
  );
}

export default function RoomsPage() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const { rooms, guests, contracts, seedMockData, updateRoomStatus } =
    useApartmentStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RoomStatus>('ALL');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  const roomStatusSummary = useMemo(
    () =>
      roomStatuses.reduce<Record<RoomStatus, number>>((summary, status) => {
        summary[status] = rooms.filter((room) => room.status === status).length;
        return summary;
      }, {} as Record<RoomStatus, number>),
    [rooms]
  );

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const keyword = search.trim().toLowerCase();

      const matchSearch =
        room.roomNumber.toLowerCase().includes(keyword) ||
        `${room.building}-${room.roomNumber}`.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === 'ALL' ? true : room.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [rooms, search, statusFilter]);

  const handleRoomAction = (
    roomId: string,
    status: 'AVAILABLE' | 'CLEANING' | 'MAINTENANCE'
  ) => {
    const result = updateRoomStatus(roomId, status);

    if (!result.success) {
      setActionError(t(result.message || 'cannotUpdateRoomWithActiveContract'));
      setActionMessage('');
      return;
    }

    setActionError('');
    setActionMessage(t('roomStatusUpdated'));
  };

  return (
    <Box>
      <Box
        rounded="3xl"
        p={{ base: '5', md: '6' }}
        color="white"
        bg="linear-gradient(140deg, #0E3E4A 0%, #135D66 62%, #8BD7CB 100%)"
        boxShadow="panel"
      >
        <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="whiteAlpha.700">
          {t('roomOverview')}
        </Text>
        <Text mt="3" fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" lineHeight="1.1">
          {t('roomList')}
        </Text>
        <Text mt="4" maxW="680px" fontSize="md" lineHeight="1.7" color="whiteAlpha.800">
          {t('roomOverviewHint')}
        </Text>

        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', xl: 'repeat(5, 1fr)' }}
          gap="3"
          mt={{ base: '5', md: '8' }}
        >
          <Box rounded="2xl" bg="rgba(255, 255, 255, 0.14)" p="4">
            <Text fontSize="sm" color="whiteAlpha.700">
              {t('allRooms')}
            </Text>
            <Text mt="2" fontSize="3xl" fontWeight="bold">
              {rooms.length}
            </Text>
          </Box>

          {roomStatuses.map((status) => (
            <Box key={status} rounded="2xl" bg="rgba(255, 255, 255, 0.14)" p="4">
              <Text fontSize="sm" color="whiteAlpha.700">
                {getStatusLabel(status, language)}
              </Text>
              <Text mt="2" fontSize="3xl" fontWeight="bold">
                {roomStatusSummary[status] || 0}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>

      <Box mt="5">
        <SurfaceCard>
          <Grid templateColumns={{ base: '1fr', xl: '1.1fr 0.9fr' }} gap="4">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="textMuted">
                {t('searchRoom')}
              </Text>
              <input
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                placeholder="101 / A-101"
                className="app-input mt-2"
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" color="textMuted">
                {t('filterStatus')}
              </Text>
              <select
                value={statusFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value as 'ALL' | RoomStatus)
                }
                className="app-select mt-2"
              >
                <option value="ALL">{t('allStatus')}</option>
                {roomStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status, language)}
                  </option>
                ))}
              </select>
            </Box>
          </Grid>

          <Flex mt="4" align="center" justify="space-between" gap="3" wrap="wrap">
            <Text color="textMuted">
              {t('visibleRooms')}: {filteredRooms.length}
            </Text>
            <Flex gap="2" wrap="wrap">
              {roomStatuses.map((status) => (
                <Box
                  key={status}
                  rounded="full"
                  px="3"
                  py="1.5"
                  fontSize="xs"
                  fontWeight="bold"
                  color="brandDark"
                  bg="rgba(255, 255, 255, 0.72)"
                  border="1px solid"
                  borderColor="rgba(15, 118, 110, 0.12)"
                >
                  {getStatusLabel(status, language)}: {roomStatusSummary[status] || 0}
                </Box>
              ))}
            </Flex>
          </Flex>
        </SurfaceCard>
      </Box>

      {actionMessage ? (
        <Box
          mt="4"
          rounded="2xl"
          border="1px solid"
          borderColor="rgba(15, 118, 110, 0.16)"
          bg="rgba(15, 118, 110, 0.08)"
          px="4"
          py="3"
        >
          <Text color="brandDark" fontSize="sm" fontWeight="medium">
            {actionMessage}
          </Text>
        </Box>
      ) : null}

      {actionError ? (
        <Box
          mt="4"
          rounded="2xl"
          border="1px solid"
          borderColor="rgba(180, 35, 24, 0.12)"
          bg="rgba(244, 67, 54, 0.08)"
          px="4"
          py="3"
        >
          <Text color="#B42318" fontSize="sm" fontWeight="medium">
            {actionError}
          </Text>
        </Box>
      ) : null}

      {filteredRooms.length === 0 ? (
        <Box mt="5">
          <SurfaceCard>
            <Text fontSize="lg" fontWeight="semibold" color="brandDark">
              {t('noRoomsFound')}
            </Text>
            <Text mt="2" color="textMuted">
              {t('roomOverviewHint')}
            </Text>
          </SurfaceCard>
        </Box>
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
          gap="4"
          mt="5"
        >
          {filteredRooms.map((room) => {
            const contract = getActiveContractByRoomId(room.id, contracts);
            const guest = getGuestById(contract?.guestId, guests);

            return (
              <Box
                key={room.id}
                position="relative"
                overflow="hidden"
                bg="rgba(255, 255, 255, 0.82)"
                rounded="3xl"
                border="1px solid"
                borderColor="rgba(15, 118, 110, 0.12)"
                boxShadow="panel"
                backdropFilter="blur(16px)"
                p="5"
                cursor="pointer"
                transition="transform 0.2s ease, box-shadow 0.2s ease"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: '0 36px 64px -40px rgba(14, 62, 74, 0.34)',
                }}
                onClick={() => setSelectedRoom(room)}
              >
                <Box
                  position="absolute"
                  insetX="0"
                  top="0"
                  h="1.5"
                  bg={statusAccentMap[room.status]}
                />

                <Flex align="start" justify="space-between" gap="4">
                  <Box>
                    <Text fontSize="3xl" fontWeight="bold" lineHeight="1" color="brandDark">
                      {room.roomNumber}
                    </Text>
                    <Text mt="2" color="textMuted">
                      {t('building')}: {room.building} · {t('floor')}: {room.floor}
                    </Text>
                  </Box>

                  <StatusPill
                    label={getStatusLabel(room.status, language)}
                    toneClassName={getStatusClasses(room.status)}
                    size="xs"
                  />
                </Flex>

                <Box
                  mt="5"
                  rounded="2xl"
                  bg="surfaceMuted"
                  border="1px solid"
                  borderColor="rgba(15, 118, 110, 0.08)"
                  p="4"
                >
                  <Flex direction="column" gap="2.5">
                    <Flex align="center" justify="space-between" gap="4">
                      <Text fontSize="sm" color="textMuted">
                        {t('guestName')}
                      </Text>
                      <Text fontWeight="medium" color="brandDark" textAlign="right">
                        {guest ? `${guest.firstName} ${guest.lastName}` : t('noGuest')}
                      </Text>
                    </Flex>

                    <Flex align="center" justify="space-between" gap="4">
                      <Text fontSize="sm" color="textMuted">
                        {t('stayType')}
                      </Text>
                      <Text fontWeight="medium" color="brandDark">
                        {contract
                          ? contract.stayType === 'DAILY'
                            ? t('daily')
                            : t('monthly')
                          : '-'}
                      </Text>
                    </Flex>

                    <Flex align="center" justify="space-between" gap="4">
                      <Text fontSize="sm" color="textMuted">
                        {t('price')}
                      </Text>
                      <Text fontWeight="medium" color="brandDark">
                        {contract ? `${contract.price.toLocaleString()} THB` : '-'}
                      </Text>
                    </Flex>

                    <Flex align="center" justify="space-between" gap="4">
                      <Text fontSize="sm" color="textMuted">
                        {t('checkIn')}
                      </Text>
                      <Text fontWeight="medium" color="brandDark">
                        {contract?.checkInDate || '-'}
                      </Text>
                    </Flex>

                    <Flex align="center" justify="space-between" gap="4">
                      <Text fontSize="sm" color="textMuted">
                        {t('checkOut')}
                      </Text>
                      <Text fontWeight="medium" color="brandDark">
                        {contract?.checkOutDate || '-'}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>

                <Box mt="5">
                  <Text fontSize="sm" fontWeight="semibold" color="brandDark">
                    {t('roomActions')}
                  </Text>

                  {contract ? (
                    <Box
                      mt="3"
                      rounded="2xl"
                      border="1px solid"
                      borderColor="rgba(15, 118, 110, 0.12)"
                      bg="surfaceMuted"
                      px="4"
                      py="3"
                    >
                      <Text fontSize="sm" color="textMuted">
                        {t('linkedToContract')}
                      </Text>
                    </Box>
                  ) : (
                    <Flex mt="3" gap="2" wrap="wrap">
                      <Button
                        size="sm"
                        rounded="full"
                        border="1px solid"
                        borderColor="rgba(15, 118, 110, 0.14)"
                        bg="rgba(15, 118, 110, 0.08)"
                        color="brandDark"
                        _hover={{ bg: 'rgba(15, 118, 110, 0.14)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoomAction(room.id, 'AVAILABLE');
                        }}
                      >
                        {t('markAvailable')}
                      </Button>

                      <Button
                        size="sm"
                        rounded="full"
                        border="1px solid"
                        borderColor="rgba(30, 94, 122, 0.16)"
                        bg="rgba(30, 94, 122, 0.08)"
                        color="#1E5E7A"
                        _hover={{ bg: 'rgba(30, 94, 122, 0.14)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoomAction(room.id, 'CLEANING');
                        }}
                      >
                        {t('markCleaning')}
                      </Button>

                      <Button
                        size="sm"
                        rounded="full"
                        border="1px solid"
                        borderColor="rgba(71, 84, 103, 0.16)"
                        bg="rgba(71, 84, 103, 0.08)"
                        color="#344054"
                        _hover={{ bg: 'rgba(71, 84, 103, 0.14)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoomAction(room.id, 'MAINTENANCE');
                        }}
                      >
                        {t('markMaintenance')}
                      </Button>
                    </Flex>
                  )}
                </Box>
              </Box>
            );
          })}
        </Grid>
      )}

      <RoomDetailDrawer
        room={selectedRoom}
        contract={
          selectedRoom
            ? getActiveContractByRoomId(selectedRoom.id, contracts)
            : undefined
        }
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </Box>
  );
}
