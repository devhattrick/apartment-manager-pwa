import { Box, Button, Grid, Heading, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
      <Heading size="lg" color="brandDark">
        {t('roomList')}
      </Heading>

      <Text mt="2" color="textMuted">
        {t('allRooms')}: {filteredRooms.length}
      </Text>

      <Box
        mt="4"
        bg="white"
        rounded="2xl"
        border="1px solid"
        borderColor="borderSubtle"
        shadow="sm"
        p="4"
        className="grid gap-4 md:grid-cols-2"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t('searchRoom')}
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="101 / A-101"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t('filterStatus')}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | RoomStatus)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          >
            <option value="ALL">{t('allStatus')}</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="CLEANING">Cleaning</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </Box>

      {actionMessage ? (
        <Text mt="3" color="green.600" fontSize="sm">
          {actionMessage}
        </Text>
      ) : null}

      {actionError ? (
        <Text mt="3" color="red.500" fontSize="sm">
          {actionError}
        </Text>
      ) : null}

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
        gap="4"
        mt="6"
      >
        {filteredRooms.map((room) => {
          const contract = getActiveContractByRoomId(room.id, contracts);
          const guest = getGuestById(contract?.guestId, guests);

          return (
            <Box
              key={room.id}
              bg="white"
              rounded="2xl"
              border="1px solid"
              borderColor="borderSubtle"
              shadow="sm"
              p="5"
              cursor="pointer"
              onClick={() => setSelectedRoom(room)}
            >
              <Box className="flex items-start justify-between gap-3">
                <Box>
                  <Text fontSize="2xl" fontWeight="bold" color="brandDark">
                    {room.roomNumber}
                  </Text>
                  <Text color="textMuted">
                    {t('building')}: {room.building} · {t('floor')}: {room.floor}
                  </Text>
                </Box>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    room.status
                  )}`}
                >
                  {getStatusLabel(room.status, language)}
                </span>
              </Box>

              <Box mt="4" className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">{t('guestName')}: </span>
                  <span>{guest ? `${guest.firstName} ${guest.lastName}` : t('noGuest')}</span>
                </div>

                <div>
                  <span className="font-medium">{t('stayType')}: </span>
                  <span>
                    {contract
                      ? contract.stayType === 'DAILY'
                        ? t('daily')
                        : t('monthly')
                      : '-'}
                  </span>
                </div>

                <div>
                  <span className="font-medium">{t('price')}: </span>
                  <span>{contract ? `${contract.price.toLocaleString()} THB` : '-'}</span>
                </div>

                <div>
                  <span className="font-medium">{t('checkIn')}: </span>
                  <span>{contract?.checkInDate || '-'}</span>
                </div>

                <div>
                  <span className="font-medium">{t('checkOut')}: </span>
                  <span>{contract?.checkOutDate || '-'}</span>
                </div>
              </Box>

              <Box mt="4">
                <Text fontSize="sm" fontWeight="medium" mb="2">
                  {t('roomActions')}
                </Text>

                {contract ? (
                  <Text fontSize="sm" color="textMuted">
                    {t('linkedToContract')}
                  </Text>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      rounded="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoomAction(room.id, 'AVAILABLE');
                      }}
                    >
                      {t('markAvailable')}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      rounded="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoomAction(room.id, 'CLEANING');
                      }}
                    >
                      {t('markCleaning')}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      rounded="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoomAction(room.id, 'MAINTENANCE');
                      }}
                    >
                      {t('markMaintenance')}
                    </Button>
                  </div>
                )}
              </Box>
            </Box>
          );
        })}
      </Grid>

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