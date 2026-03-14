import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getRevenueSummary, getRoomSummary } from '../lib/report';
import { useApartmentStore } from '../store/useApartmentStore';

export default function ReportsPage() {
  const { t } = useTranslation();
  const { rooms, contracts, seedMockData } = useApartmentStore();

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  const roomSummary = getRoomSummary(rooms);
  const revenueSummary = getRevenueSummary(contracts);

  const activeContractsCount = contracts.filter((item) => item.status === 'ACTIVE').length;
  const reservedContractsCount = contracts.filter((item) => item.status === 'RESERVED').length;

  return (
    <Box>
      <Heading size="lg" color="brandDark">
        {t('reportsTitle')}
      </Heading>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
        gap="4"
        mt="6"
      >
        <Box bg="white" rounded="2xl" p="5" border="1px solid" borderColor="borderSubtle" shadow="sm">
          <Text color="textMuted">{t('totalRooms')}</Text>
          <Text fontSize="3xl" fontWeight="bold" mt="2">{roomSummary.total}</Text>
        </Box>

        <Box bg="white" rounded="2xl" p="5" border="1px solid" borderColor="borderSubtle" shadow="sm">
          <Text color="textMuted">{t('availableRooms')}</Text>
          <Text fontSize="3xl" fontWeight="bold" mt="2">{roomSummary.available}</Text>
        </Box>

        <Box bg="white" rounded="2xl" p="5" border="1px solid" borderColor="borderSubtle" shadow="sm">
          <Text color="textMuted">{t('maintenanceRooms')}</Text>
          <Text fontSize="3xl" fontWeight="bold" mt="2">{roomSummary.maintenance}</Text>
        </Box>

        <Box bg="white" rounded="2xl" p="5" border="1px solid" borderColor="borderSubtle" shadow="sm">
          <Text color="textMuted">{t('activeContracts')}</Text>
          <Text fontSize="3xl" fontWeight="bold" mt="2">{activeContractsCount}</Text>
        </Box>

        <Box bg="white" rounded="2xl" p="5" border="1px solid" borderColor="borderSubtle" shadow="sm">
          <Text color="textMuted">{t('reservedContracts')}</Text>
          <Text fontSize="3xl" fontWeight="bold" mt="2">{reservedContractsCount}</Text>
        </Box>

        <Box bg="white" rounded="2xl" p="5" border="1px solid" borderColor="borderSubtle" shadow="sm">
          <Text color="textMuted">{t('totalRevenue')}</Text>
          <Text fontSize="3xl" fontWeight="bold" mt="2">
            {revenueSummary.totalRevenue.toLocaleString()} THB
          </Text>
        </Box>
      </Grid>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap="4"
        mt="6"
      >
        <Box bg="white" rounded="2xl" p="5" border="1px solid" borderColor="borderSubtle" shadow="sm">
          <Text color="textMuted">{t('dailyRevenue')}</Text>
          <Text fontSize="2xl" fontWeight="bold" mt="2">
            {revenueSummary.dailyRevenue.toLocaleString()} THB
          </Text>
        </Box>

        <Box bg="white" rounded="2xl" p="5" border="1px solid" borderColor="borderSubtle" shadow="sm">
          <Text color="textMuted">{t('monthlyRevenue')}</Text>
          <Text fontSize="2xl" fontWeight="bold" mt="2">
            {revenueSummary.monthlyRevenue.toLocaleString()} THB
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}