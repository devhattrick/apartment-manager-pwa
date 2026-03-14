import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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

      <Box mt="6" className="space-y-6">
        {sortedFloors.map((floor) => (
          <Box key={floor}>
            <Text fontSize="lg" fontWeight="bold" mb="3" color="brandDark">
              {t('floor')} {floor}
            </Text>

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
                    rounded="2xl"
                    border="1px solid"
                    borderColor="borderSubtle"
                    bg="white"
                    p="4"
                    shadow="sm"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-xl font-bold text-slate-800">{room.roomNumber}</div>
                      <span
                        className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${getStatusClasses(
                          room.status
                        )}`}
                      >
                        {getStatusLabel(room.status, language)}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-slate-600">
                      <div>{room.roomType}</div>
                      <div>{guest ? `${guest.firstName} ${guest.lastName}` : t('noGuest')}</div>
                      <div>
                        {contract
                          ? `${contract.checkInDate} → ${contract.checkOutDate}`
                          : '-'}
                      </div>
                    </div>
                  </Box>
                );
              })}
            </Grid>
          </Box>
        ))}
      </Box>
    </Box>
  );
}