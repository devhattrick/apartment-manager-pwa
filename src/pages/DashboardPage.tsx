import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getOccupancyRate, getRevenueSummary, getRoomSummary } from '../lib/report';
import { useApartmentStore } from '../store/useApartmentStore';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

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

export default function DashboardPage() {
  const { t } = useTranslation();
  const { rooms, contracts, guests, seedMockData } = useApartmentStore();

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  const roomSummary = getRoomSummary(rooms);
  const occupancyRate = getOccupancyRate(rooms);
  const revenueSummary = getRevenueSummary(contracts);
  const occupiedRooms = roomSummary.occupied + roomSummary.reserved;
  const activeContractsCount = contracts.filter((item) => item.status === 'ACTIVE').length;
  const today = new Date().toISOString().slice(0, 10);

  const todayCheckInCount = contracts.filter(
    (item) =>
      item.checkInDate === today &&
      (item.status === 'ACTIVE' || item.status === 'RESERVED')
  ).length;

  const upcomingCheckOutCount = contracts.filter((item) => {
    if (item.status !== 'ACTIVE') return false;

    const diffDays = Math.round(
      (Date.parse(item.checkOutDate) - Date.parse(today)) / DAY_IN_MS
    );

    return diffDays >= 0 && diffDays <= 3;
  }).length;

  const statCards = [
    {
      label: t('totalRooms'),
      value: roomSummary.total.toString(),
      note: `${roomSummary.available} ${t('available')}`,
      accent: '#0E3E4A',
    },
    {
      label: t('availableRooms'),
      value: roomSummary.available.toString(),
      note: `${roomSummary.maintenance} ${t('maintenance')}`,
      accent: '#0F766E',
    },
    {
      label: t('occupiedRooms'),
      value: occupiedRooms.toString(),
      note: `${activeContractsCount} ${t('activeContracts')}`,
      accent: '#C46C2A',
    },
    {
      label: t('occupancyRate'),
      value: `${occupancyRate}%`,
      note: `${todayCheckInCount} ${t('todayCheckIn')}`,
      accent: '#1E5E7A',
    },
  ];

  const recentContracts = contracts.slice(-3).reverse();

  return (
    <Box>
      <Grid templateColumns={{ base: '1fr', xl: '1.45fr 1fr' }} gap="5">
        <Box
          rounded="3xl"
          p={{ base: '5', md: '6' }}
          color="white"
          bg="linear-gradient(140deg, #0E3E4A 0%, #0F766E 58%, #70C8BD 100%)"
          boxShadow="panel"
        >
          <Text fontSize="xs" letterSpacing="0.18em" textTransform="uppercase" color="whiteAlpha.700">
            {t('dashboard')}
          </Text>
          <Text mt="3" fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" lineHeight="1.1">
            {t('dashboardIntro')}
          </Text>
          <Text mt="4" maxW="560px" fontSize="md" lineHeight="1.7" color="whiteAlpha.800">
            {t('appTagline')}
          </Text>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap="3"
            mt={{ base: '5', md: '8' }}
          >
            <Box rounded="2xl" bg="rgba(255, 255, 255, 0.14)" p="4">
              <Text fontSize="sm" color="whiteAlpha.700">
                {t('activeContracts')}
              </Text>
              <Text mt="2" fontSize="3xl" fontWeight="bold">
                {activeContractsCount}
              </Text>
            </Box>

            <Box rounded="2xl" bg="rgba(255, 255, 255, 0.14)" p="4">
              <Text fontSize="sm" color="whiteAlpha.700">
                {t('guestsTitle')}
              </Text>
              <Text mt="2" fontSize="3xl" fontWeight="bold">
                {guests.length}
              </Text>
            </Box>

            <Box rounded="2xl" bg="rgba(255, 255, 255, 0.14)" p="4">
              <Text fontSize="sm" color="whiteAlpha.700">
                {t('upcomingCheckOut')}
              </Text>
              <Text mt="2" fontSize="3xl" fontWeight="bold">
                {upcomingCheckOutCount}
              </Text>
            </Box>
          </Grid>
        </Box>

        <SurfaceCard>
          <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
            {t('roomOverview')}
          </Text>
          <Text mt="3" fontSize="2xl" fontWeight="semibold" color="brandDark">
            {occupiedRooms} / {roomSummary.total} {t('rooms')}
          </Text>
          <Text mt="2" color="textMuted" lineHeight="1.7">
            {t('welcome')}
          </Text>

          <Box mt="5" rounded="full" h="3" bg="rgba(15, 118, 110, 0.12)" overflow="hidden">
            <Box h="full" w={`${Math.min(occupancyRate, 100)}%`} rounded="full" bg="brandPrimary" />
          </Box>

          <Grid templateColumns="repeat(2, 1fr)" gap="3" mt="6">
            <Box rounded="2xl" bg="surfaceMuted" p="4">
              <Text fontSize="sm" color="textMuted">
                {t('todayCheckIn')}
              </Text>
              <Text mt="2" fontSize="2xl" fontWeight="bold" color="brandDark">
                {todayCheckInCount}
              </Text>
            </Box>

            <Box rounded="2xl" bg="surfaceMuted" p="4">
              <Text fontSize="sm" color="textMuted">
                {t('maintenanceRooms')}
              </Text>
              <Text mt="2" fontSize="2xl" fontWeight="bold" color="brandDark">
                {roomSummary.maintenance}
              </Text>
            </Box>
          </Grid>
        </SurfaceCard>
      </Grid>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }}
        gap="4"
        mt="5"
      >
        {statCards.map((card) => (
          <SurfaceCard key={card.label}>
            <Flex align="center" justify="space-between" gap="3">
              <Text fontSize="sm" color="textMuted">
                {card.label}
              </Text>
              <Box w="3" h="3" rounded="full" bg={card.accent} />
            </Flex>
            <Text mt="4" fontSize="4xl" fontWeight="bold" lineHeight="1" color="brandDark">
              {card.value}
            </Text>
            <Text mt="3" fontSize="sm" color="textMuted">
              {card.note}
            </Text>
          </SurfaceCard>
        ))}
      </Grid>

      <Grid templateColumns={{ base: '1fr', xl: '1.2fr 0.95fr' }} gap="5" mt="5">
        <SurfaceCard>
          <Flex align="center" justify="space-between" gap="3">
            <Box>
              <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
                {t('recentContracts')}
              </Text>
              <Text mt="2" fontSize="2xl" fontWeight="semibold" color="brandDark">
                {t('contractsTitle')}
              </Text>
            </Box>
            <Text fontSize="sm" color="textMuted">
              {recentContracts.length} {t('contracts')}
            </Text>
          </Flex>

          <Box mt="5">
            {recentContracts.length === 0 ? (
              <Text color="textMuted">{t('noContracts')}</Text>
            ) : (
              <Flex direction="column" gap="3">
                {recentContracts.map((contract) => {
                  const guest = guests.find((item) => item.id === contract.guestId);
                  const room = rooms.find((item) => item.id === contract.roomId);

                  return (
                    <Box
                      key={contract.id}
                      rounded="2xl"
                      border="1px solid"
                      borderColor="rgba(15, 118, 110, 0.12)"
                      bg="surfaceMuted"
                      p="4"
                    >
                      <Flex align="start" justify="space-between" gap="4">
                        <Box>
                          <Text fontSize="lg" fontWeight="semibold" color="brandDark">
                            Room {room?.roomNumber || '-'}
                          </Text>
                          <Text mt="1" color="textMuted">
                            {guest ? `${guest.firstName} ${guest.lastName}` : '-'}
                          </Text>
                        </Box>
                        <Box
                          rounded="full"
                          px="3"
                          py="1.5"
                          bg="rgba(15, 118, 110, 0.1)"
                          color="brandPrimary"
                          fontSize="xs"
                          fontWeight="bold"
                          textTransform="uppercase"
                          letterSpacing="0.08em"
                        >
                          {contract.stayType === 'DAILY' ? t('daily') : t('monthly')}
                        </Box>
                      </Flex>

                      <Flex mt="4" align="center" justify="space-between" gap="3" wrap="wrap">
                        <Text fontSize="sm" color="textMuted">
                          {contract.checkInDate} - {contract.checkOutDate}
                        </Text>
                        <Text fontSize="lg" fontWeight="semibold" color="brandDark">
                          {contract.price.toLocaleString()} THB
                        </Text>
                      </Flex>
                    </Box>
                  );
                })}
              </Flex>
            )}
          </Box>
        </SurfaceCard>

        <SurfaceCard>
          <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
            {t('revenueSnapshot')}
          </Text>
          <Text mt="2" fontSize="2xl" fontWeight="semibold" color="brandDark">
            {t('reportsTitle')}
          </Text>

          <Flex direction="column" gap="3" mt="5">
            <Box rounded="2xl" bg="surfaceMuted" p="4">
              <Text fontSize="sm" color="textMuted">
                {t('dailyRevenue')}
              </Text>
              <Text mt="2" fontSize="2xl" fontWeight="bold" color="brandDark">
                {revenueSummary.dailyRevenue.toLocaleString()} THB
              </Text>
            </Box>

            <Box rounded="2xl" bg="surfaceMuted" p="4">
              <Text fontSize="sm" color="textMuted">
                {t('monthlyRevenue')}
              </Text>
              <Text mt="2" fontSize="2xl" fontWeight="bold" color="brandDark">
                {revenueSummary.monthlyRevenue.toLocaleString()} THB
              </Text>
            </Box>

            <Box
              rounded="2xl"
              p="4"
              color="white"
              bg="linear-gradient(135deg, #0E3E4A 0%, #1E5E7A 100%)"
            >
              <Text fontSize="sm" color="whiteAlpha.700">
                {t('totalRevenue')}
              </Text>
              <Text mt="2" fontSize="3xl" fontWeight="bold">
                {revenueSummary.totalRevenue.toLocaleString()} THB
              </Text>
            </Box>
          </Flex>
        </SurfaceCard>
      </Grid>
    </Box>
  );
}
