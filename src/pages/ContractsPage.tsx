import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StatusPill from '../components/common/StatusPill';
import { useApartmentStore } from '../store/useApartmentStore';
import { getGuestById } from '../lib/apartment';
import type { Contract } from '../types';

function getContractStatusLabel(
  status: Contract['status'],
  t: (key: string) => string
) {
  switch (status) {
    case 'ACTIVE':
      return t('active');
    case 'RESERVED':
      return t('contractReserved');
    case 'COMPLETED':
      return t('completed');
    case 'CANCELLED':
      return t('cancelled');
    default:
      return status;
  }
}

function getContractStatusClasses(status: Contract['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'RESERVED':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'COMPLETED':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'CANCELLED':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export default function ContractsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { contracts, guests, rooms, seedMockData, updateContractStatus } =
    useApartmentStore();

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  const sortedContracts = [...contracts].reverse();

  return (
    <Box>
      <Flex align="center" justify="space-between" gap="3" wrap="wrap">
        <Heading size="lg" color="brandDark">
          {t('contractsTitle')}
        </Heading>

        <Button
          bg="brandPrimary"
          color="white"
          rounded="xl"
          onClick={() => navigate('/contracts/new')}
        >
          {t('createNewContract')}
        </Button>
      </Flex>

      <Box mt="6" display="flex" flexDirection="column" gap="4">
        {sortedContracts.length === 0 ? (
          <Text color="textMuted">{t('noContracts')}</Text>
        ) : (
          sortedContracts.map((contract) => {
            const guest = getGuestById(contract.guestId, guests);
            const room = rooms.find((item) => item.id === contract.roomId);

            return (
              <Box
                key={contract.id}
                bg="rgba(255, 255, 255, 0.82)"
                rounded="3xl"
                border="1px solid"
                borderColor="rgba(15, 118, 110, 0.12)"
                boxShadow="panel"
                backdropFilter="blur(16px)"
                p={{ base: '5', md: '6' }}
              >
                <Flex align="start" justify="space-between" gap="4" wrap="wrap">
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
                      {t('contracts')}
                    </Text>
                    <Text mt="2" fontSize="2xl" fontWeight="bold" color="brandDark">
                      Room {room?.roomNumber || '-'}
                    </Text>
                  </Box>

                  <StatusPill
                    label={getContractStatusLabel(contract.status, t)}
                    toneClassName={getContractStatusClasses(contract.status)}
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
                  <Flex direction="column" gap="3">
                    <Flex align="center" justify="space-between" gap="4" wrap="wrap">
                      <Text fontSize="sm" color="textMuted">
                        {t('guestName')}
                      </Text>
                      <Text fontWeight="medium" color="brandDark">
                        {guest ? `${guest.firstName} ${guest.lastName}` : '-'}
                      </Text>
                    </Flex>

                    <Flex align="center" justify="space-between" gap="4" wrap="wrap">
                      <Text fontSize="sm" color="textMuted">
                        {t('stayType')}
                      </Text>
                      <Text fontWeight="medium" color="brandDark">
                        {contract.stayType === 'DAILY' ? t('daily') : t('monthly')}
                      </Text>
                    </Flex>

                    <Flex align="center" justify="space-between" gap="4" wrap="wrap">
                      <Text fontSize="sm" color="textMuted">
                        {t('price')}
                      </Text>
                      <Text fontWeight="medium" color="brandDark">
                        {contract.price.toLocaleString()} THB
                      </Text>
                    </Flex>

                    <Flex align="center" justify="space-between" gap="4" wrap="wrap">
                      <Text fontSize="sm" color="textMuted">
                        {t('checkIn')}
                      </Text>
                      <Text fontWeight="medium" color="brandDark">
                        {contract.checkInDate}
                      </Text>
                    </Flex>

                    <Flex align="center" justify="space-between" gap="4" wrap="wrap">
                      <Text fontSize="sm" color="textMuted">
                        {t('checkOut')}
                      </Text>
                      <Text fontWeight="medium" color="brandDark">
                        {contract.checkOutDate}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>

                <Flex mt="5" gap="2" wrap="wrap">
                  {(contract.status === 'ACTIVE' ||
                    contract.status === 'RESERVED') && (
                    <Button
                      size="sm"
                      variant="outline"
                      rounded="full"
                      onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                    >
                      {t('editContract')}
                    </Button>
                  )}

                  {contract.status === 'RESERVED' && (
                    <>
                      <Button
                        size="sm"
                        bg="brandPrimary"
                        color="white"
                        rounded="full"
                        onClick={() =>
                          updateContractStatus(contract.id, 'ACTIVE')
                        }
                      >
                        {t('checkInNow')}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        colorPalette="red"
                        rounded="full"
                        onClick={() =>
                          updateContractStatus(contract.id, 'CANCELLED')
                        }
                      >
                        {t('cancelContract')}
                      </Button>
                    </>
                  )}

                  {contract.status === 'ACTIVE' && (
                    <Button
                      size="sm"
                      colorPalette="green"
                      rounded="full"
                      onClick={() =>
                        updateContractStatus(contract.id, 'COMPLETED')
                      }
                    >
                      {t('completeContract')}
                    </Button>
                  )}
                </Flex>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
