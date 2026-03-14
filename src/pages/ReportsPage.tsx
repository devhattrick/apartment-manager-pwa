import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getOccupancyRate, getRevenueSummary, getRoomSummary } from '../lib/report';
import { useApartmentStore } from '../store/useApartmentStore';

type ChartItem = {
  color: string;
  label: string;
  value: number;
};

function ReportCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
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
      <Text color="textMuted" fontSize="sm">
        {label}
      </Text>
      <Text fontSize="4xl" fontWeight="bold" mt="3" color="brandDark" lineHeight="1">
        {value}
      </Text>
    </Box>
  );
}

function ChartPanel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
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
      <Text
        fontSize="xs"
        fontWeight="bold"
        letterSpacing="0.18em"
        textTransform="uppercase"
        color="brandPrimary"
      >
        {eyebrow}
      </Text>
      <Text mt="3" fontSize="2xl" fontWeight="semibold" color="brandDark">
        {title}
      </Text>
      <Text mt="2" color="textMuted" lineHeight="1.7">
        {description}
      </Text>
      <Box mt="6">{children}</Box>
    </Box>
  );
}

function getConicGradient(items: ChartItem[]) {
  const visibleItems = items.filter((item) => item.value > 0);
  const total = visibleItems.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return 'conic-gradient(from -90deg, rgba(15, 118, 110, 0.12) 0% 100%)';
  }

  let progress = 0;

  const stops = visibleItems.map((item) => {
    const start = progress;
    progress += (item.value / total) * 100;
    return `${item.color} ${start}% ${progress}%`;
  });

  return `conic-gradient(from -90deg, ${stops.join(', ')})`;
}

function formatPercent(value: number, total: number) {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

function DonutChart({
  items,
  centerLabel,
  centerValue,
}: {
  items: ChartItem[];
  centerLabel: string;
  centerValue: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <Grid templateColumns={{ base: '1fr', md: '260px 1fr' }} gap="5" alignItems="center">
      <Box position="relative" w="240px" h="240px" mx={{ base: 'auto', md: '0' }}>
        <Box
          position="absolute"
          inset="0"
          rounded="full"
          style={{ background: getConicGradient(items) }}
          boxShadow="0 28px 48px -34px rgba(14, 62, 74, 0.38)"
        />
        <Flex
          position="absolute"
          inset="26px"
          rounded="full"
          bg="rgba(248, 251, 250, 0.96)"
          border="1px solid"
          borderColor="rgba(15, 118, 110, 0.08)"
          align="center"
          justify="center"
          direction="column"
          textAlign="center"
          px="5"
        >
          <Text fontSize="sm" color="textMuted">
            {centerLabel}
          </Text>
          <Text mt="2" fontSize="4xl" fontWeight="bold" lineHeight="1" color="brandDark">
            {centerValue}
          </Text>
        </Flex>
      </Box>

      <Flex direction="column" gap="3">
        {items.map((item) => (
          <Box
            key={item.label}
            rounded="2xl"
            border="1px solid"
            borderColor="rgba(15, 118, 110, 0.08)"
            bg="surfaceMuted"
            p="4"
          >
            <Flex align="center" justify="space-between" gap="3">
              <Flex align="center" gap="3">
                <Box w="3" h="3" rounded="full" bg={item.color} flexShrink={0} />
                <Text fontWeight="medium" color="brandDark">
                  {item.label}
                </Text>
              </Flex>
              <Text fontWeight="semibold" color="brandDark">
                {item.value}
              </Text>
            </Flex>
            <Text mt="2" fontSize="sm" color="textMuted">
              {formatPercent(item.value, total)}
            </Text>
          </Box>
        ))}
      </Flex>
    </Grid>
  );
}

function HorizontalBarChart({
  items,
  total,
}: {
  items: ChartItem[];
  total: number;
}) {
  return (
    <Flex direction="column" gap="4">
      {items.map((item) => {
        const width = total === 0 ? 0 : (item.value / total) * 100;

        return (
          <Box
            key={item.label}
            rounded="2xl"
            border="1px solid"
            borderColor="rgba(15, 118, 110, 0.08)"
            bg="surfaceMuted"
            p="4"
          >
            <Flex align="center" justify="space-between" gap="4" wrap="wrap">
              <Flex align="center" gap="3">
                <Box w="3" h="3" rounded="full" bg={item.color} flexShrink={0} />
                <Text fontWeight="medium" color="brandDark">
                  {item.label}
                </Text>
              </Flex>
              <Text fontWeight="semibold" color="brandDark">
                {item.value.toLocaleString()} THB
              </Text>
            </Flex>

            <Box mt="4" rounded="full" h="3" bg="rgba(15, 118, 110, 0.1)" overflow="hidden">
              <Box
                h="full"
                rounded="full"
                bg={item.color}
                w={`${width}%`}
                minW={item.value > 0 ? '8px' : '0'}
                transition="width 0.3s ease"
              />
            </Box>

            <Text mt="2" fontSize="sm" color="textMuted">
              {formatPercent(item.value, total)}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
}

export default function ReportsPage() {
  const { t } = useTranslation();
  const { rooms, contracts, seedMockData } = useApartmentStore();

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  const roomSummary = getRoomSummary(rooms);
  const occupancyRate = getOccupancyRate(rooms);
  const revenueSummary = getRevenueSummary(contracts);

  const activeContractsCount = contracts.filter((item) => item.status === 'ACTIVE').length;
  const reservedContractsCount = contracts.filter((item) => item.status === 'RESERVED').length;

  const roomStatusItems: ChartItem[] = [
    { label: t('available'), value: roomSummary.available, color: '#0F766E' },
    { label: t('occupied'), value: roomSummary.occupied, color: '#C46C2A' },
    { label: t('reserved'), value: roomSummary.reserved, color: '#D97706' },
    { label: t('maintenance'), value: roomSummary.maintenance, color: '#64748B' },
  ];

  const revenueItems: ChartItem[] = [
    { label: t('daily'), value: revenueSummary.dailyRevenue, color: '#1E5E7A' },
    { label: t('monthly'), value: revenueSummary.monthlyRevenue, color: '#0F766E' },
  ];

  return (
    <Box>
      <Box
        rounded="3xl"
        p={{ base: '5', md: '6' }}
        color="white"
        bg="linear-gradient(140deg, #0E3E4A 0%, #1E5E7A 58%, #78CFC3 100%)"
        boxShadow="panel"
      >
        <Text
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="0.18em"
          textTransform="uppercase"
          color="whiteAlpha.700"
        >
          {t('reportsTitle')}
        </Text>
        <Heading mt="3" size="2xl">
          {t('reportsTitle')}
        </Heading>
        <Text mt="4" maxW="620px" color="whiteAlpha.800" lineHeight="1.7">
          {t('dashboardIntro')}
        </Text>
      </Box>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
        gap="4"
        mt="5"
      >
        <ReportCard label={t('totalRooms')} value={roomSummary.total} />
        <ReportCard label={t('availableRooms')} value={roomSummary.available} />
        <ReportCard label={t('maintenanceRooms')} value={roomSummary.maintenance} />
        <ReportCard label={t('activeContracts')} value={activeContractsCount} />
        <ReportCard label={t('reservedContracts')} value={reservedContractsCount} />
        <ReportCard
          label={t('totalRevenue')}
          value={`${revenueSummary.totalRevenue.toLocaleString()} THB`}
        />
      </Grid>

      <Grid templateColumns={{ base: '1fr', xl: '1.15fr 1fr' }} gap="5" mt="5">
        <ChartPanel
          eyebrow={t('roomStatusMix')}
          title={t('occupancyRate')}
          description={t('inventoryDistribution')}
        >
          <DonutChart
            items={roomStatusItems}
            centerLabel={t('occupancyRate')}
            centerValue={`${occupancyRate}%`}
          />
        </ChartPanel>

        <ChartPanel
          eyebrow={t('revenueByStayType')}
          title={t('totalRevenue')}
          description={t('revenueDistribution')}
        >
          <HorizontalBarChart
            items={revenueItems}
            total={revenueSummary.totalRevenue}
          />
        </ChartPanel>
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4" mt="5">
        <Box
          bg="rgba(255, 255, 255, 0.82)"
          rounded="3xl"
          border="1px solid"
          borderColor="rgba(15, 118, 110, 0.12)"
          boxShadow="panel"
          backdropFilter="blur(16px)"
          p={{ base: '5', md: '6' }}
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.18em"
            textTransform="uppercase"
            color="brandPrimary"
          >
            {t('dailyRevenue')}
          </Text>
          <Flex mt="4" align="end" justify="space-between" gap="4" wrap="wrap">
            <Text fontSize="4xl" fontWeight="bold" color="brandDark" lineHeight="1">
              {revenueSummary.dailyRevenue.toLocaleString()} THB
            </Text>
            <Text color="textMuted">{formatPercent(revenueSummary.dailyRevenue, revenueSummary.totalRevenue)}</Text>
          </Flex>
        </Box>

        <Box
          rounded="3xl"
          p={{ base: '5', md: '6' }}
          color="white"
          bg="linear-gradient(135deg, #0F766E 0%, #0E3E4A 100%)"
          boxShadow="panel"
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.18em"
            textTransform="uppercase"
            color="whiteAlpha.700"
          >
            {t('monthlyRevenue')}
          </Text>
          <Flex mt="4" align="end" justify="space-between" gap="4" wrap="wrap">
            <Text fontSize="4xl" fontWeight="bold" lineHeight="1">
              {revenueSummary.monthlyRevenue.toLocaleString()} THB
            </Text>
            <Text color="whiteAlpha.700">
              {formatPercent(revenueSummary.monthlyRevenue, revenueSummary.totalRevenue)}
            </Text>
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
}
