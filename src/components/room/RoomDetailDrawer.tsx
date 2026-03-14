import { Box, Button, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
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
      bg="rgba(15,23,42,0.35)"
      onClick={onClose}
    >
      <Box
        position="absolute"
        top="0"
        right="0"
        h="100%"
        w={{ base: '100%', md: '420px' }}
        bg="white"
        shadow="2xl"
        p="5"
        onClick={(e) => e.stopPropagation()}
        className="overflow-y-auto"
      >
        <Box className="flex items-start justify-between gap-3">
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="brandDark">
              Room {room.roomNumber}
            </Text>
            <Text color="textMuted">
              {t('building')}: {room.building} · {t('floor')}: {room.floor}
            </Text>
          </Box>

          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </Box>

        <Box mt="4">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
              room.status
            )}`}
          >
            {getStatusLabel(room.status, language)}
          </span>
        </Box>

        <Box mt="6" className="space-y-3 text-sm">
          <div>
            <span className="font-medium">{t('guestName')}: </span>
            <span>{guest ? `${guest.firstName} ${guest.lastName}` : t('noGuest')}</span>
          </div>

          <div>
            <span className="font-medium">{t('stayType')}: </span>
            <span>
              {contract ? (contract.stayType === 'DAILY' ? t('daily') : t('monthly')) : '-'}
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

          <div>
            <span className="font-medium">Room Type: </span>
            <span>{room.roomType || '-'}</span>
          </div>

          <div>
            <span className="font-medium">Default Daily: </span>
            <span>{room.defaultDailyPrice?.toLocaleString() || '-'} THB</span>
          </div>

          <div>
            <span className="font-medium">Default Monthly: </span>
            <span>{room.defaultMonthlyPrice?.toLocaleString() || '-'} THB</span>
          </div>
        </Box>
      </Box>
    </Box>
  );
}