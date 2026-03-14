import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
      return 'bg-green-100 text-green-700 border-green-200';
    case 'RESERVED':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-700 border-blue-200';
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
      <Box className="flex items-center justify-between gap-3">
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
      </Box>

      <Box mt="6" className="space-y-4">
        {sortedContracts.length === 0 ? (
          <Text color="textMuted">{t('noContracts')}</Text>
        ) : (
          sortedContracts.map((contract) => {
            const guest = getGuestById(contract.guestId, guests);
            const room = rooms.find((item) => item.id === contract.roomId);

            return (
              <Box
                key={contract.id}
                bg="white"
                rounded="2xl"
                border="1px solid"
                borderColor="borderSubtle"
                shadow="sm"
                p="5"
              >
                <Box className="flex items-start justify-between gap-3">
                  <Text fontSize="xl" fontWeight="bold" color="brandDark">
                    Room {room?.roomNumber || '-'}
                  </Text>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getContractStatusClasses(
                      contract.status
                    )}`}
                  >
                    {getContractStatusLabel(contract.status, t)}
                  </span>
                </Box>

                <Box mt="3" className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">{t('guestName')}: </span>
                    <span>
                      {guest ? `${guest.firstName} ${guest.lastName}` : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">{t('stayType')}: </span>
                    <span>
                      {contract.stayType === 'DAILY' ? t('daily') : t('monthly')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">{t('price')}: </span>
                    <span>{contract.price.toLocaleString()} THB</span>
                  </div>
                  <div>
                    <span className="font-medium">{t('checkIn')}: </span>
                    <span>{contract.checkInDate}</span>
                  </div>
                  <div>
                    <span className="font-medium">{t('checkOut')}: </span>
                    <span>{contract.checkOutDate}</span>
                  </div>
                </Box>

                <Box mt="4" className="flex flex-wrap gap-2">
                  {(contract.status === 'ACTIVE' ||
                    contract.status === 'RESERVED') && (
                    <Button
                      size="sm"
                      variant="outline"
                      rounded="lg"
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
                        rounded="lg"
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
                        rounded="lg"
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
                      rounded="lg"
                      onClick={() =>
                        updateContractStatus(contract.id, 'COMPLETED')
                      }
                    >
                      {t('completeContract')}
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}