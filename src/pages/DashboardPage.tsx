import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getOccupancyRate, getRevenueSummary, getRoomSummary } from '../lib/report';
import { useApartmentStore } from '../store/useApartmentStore';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { rooms, contracts, guests, seedMockData } = useApartmentStore();

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  const roomSummary = getRoomSummary(rooms);
  const occupancyRate = getOccupancyRate(rooms);
  const revenueSummary = getRevenueSummary(contracts);

  const statCards = [
    { label: t('totalRooms'), value: roomSummary.total },
    { label: t('availableRooms'), value: roomSummary.available },
    { label: t('occupiedRooms'), value: roomSummary.occupied + roomSummary.reserved },
    { label: t('occupancyRate'), value: `${occupancyRate}%` },
  ];

  const recentContracts = contracts.slice(-3).reverse();

  return (
    <Box>
      <Heading size="lg" color="brandDark">
        {t('dashboard')}
      </Heading>
      <Text mt="2" color="textMuted">
        {t('welcome')}
      </Text>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }}
        gap="4"
        mt="6"
      >
        {statCards.map((card) => (
          <Box
            key={card.label}
            bg="white"
            rounded="2xl"
            p="5"
            border="1px solid"
            borderColor="borderSubtle"
            shadow="sm"
          >
            <Text color="textMuted" fontSize="sm">
              {card.label}
            </Text>
            <Text fontSize="3xl" fontWeight="bold" mt="2" color="brandDark">
              {card.value}
            </Text>
          </Box>
        ))}
      </Grid>

      <Grid
        templateColumns={{ base: '1fr', xl: '1.2fr 1fr' }}
        gap="4"
        mt="6"
      >
        <Box
          bg="white"
          rounded="2xl"
          p="5"
          border="1px solid"
          borderColor="borderSubtle"
          shadow="sm"
        >
          <Heading size="md">{t('contractsTitle')}</Heading>

          <Box mt="4" className="space-y-3">
            {recentContracts.map((contract) => {
              const guest = guests.find((item) => item.id === contract.guestId);
              const room = rooms.find((item) => item.id === contract.roomId);

              return (
                <div key={contract.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="font-medium">
                    Room {room?.roomNumber || '-'} · {guest ? `${guest.firstName} ${guest.lastName}` : '-'}
                  </div>
                  <div className="text-sm text-slate-500">
                    {contract.stayType} · {contract.price.toLocaleString()} THB
                  </div>
                </div>
              );
            })}
          </Box>
        </Box>

        <Box
          bg="white"
          rounded="2xl"
          p="5"
          border="1px solid"
          borderColor="borderSubtle"
          shadow="sm"
        >
          <Heading size="md">{t('reportsTitle')}</Heading>

          <Box mt="4" className="space-y-3 text-sm">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-slate-500">{t('dailyRevenue')}</div>
              <div className="text-xl font-bold text-slate-800">
                {revenueSummary.dailyRevenue.toLocaleString()} THB
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-slate-500">{t('monthlyRevenue')}</div>
              <div className="text-xl font-bold text-slate-800">
                {revenueSummary.monthlyRevenue.toLocaleString()} THB
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-slate-500">{t('totalRevenue')}</div>
              <div className="text-xl font-bold text-slate-800">
                {revenueSummary.totalRevenue.toLocaleString()} THB
              </div>
            </div>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}