import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormErrorText from '../components/common/FormErrorText';
import {
  contractSchema,
  type ContractFormValues,
} from '../schemas/contractSchema';
import { useApartmentStore } from '../store/useApartmentStore';

const inputClassName = 'app-input';
const selectClassName = 'app-select';

export default function CreateContractPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { rooms, guests, seedMockData, addContract } = useApartmentStore();
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      guestId: '',
      roomId: '',
      stayType: 'MONTHLY',
      price: 0,
      checkInDate: '',
      checkOutDate: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  const availableRooms = useMemo(
    () => rooms.filter((room) => room.status === 'AVAILABLE'),
    [rooms]
  );

  const roomId = watch('roomId');
  const stayType = watch('stayType');

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === roomId),
    [rooms, roomId]
  );

  useEffect(() => {
    if (!selectedRoom) return;

    if (stayType === 'DAILY' && selectedRoom.defaultDailyPrice) {
      setValue('price', selectedRoom.defaultDailyPrice);
    }

    if (stayType === 'MONTHLY' && selectedRoom.defaultMonthlyPrice) {
      setValue('price', selectedRoom.defaultMonthlyPrice);
    }
  }, [selectedRoom, stayType, setValue]);

  const onSubmit = (values: ContractFormValues) => {
    const room = rooms.find((item) => item.id === values.roomId);

    if (!room || room.status !== 'AVAILABLE') {
      setSubmitError(t('roomNotAvailable'));
      return;
    }

    const result = addContract(values);

    if (!result.success) {
      setSubmitError(t(result.message || 'roomNotAvailable'));
      return;
    }

    setSubmitError('');
    navigate('/contracts');
  };

  return (
    <Box maxW="840px">
      <Button variant="outline" rounded="full" onClick={() => navigate('/contracts')}>
        {t('backToContracts')}
      </Button>

      <Heading size="lg" color="brandDark" mt="4">
        {t('createContractTitle')}
      </Heading>
      <Text mt="2" color="textMuted">
        {t('createNewContract')}
      </Text>

      {guests.length === 0 ? (
        <Box
          mt="6"
          rounded="3xl"
          border="1px solid"
          borderColor="rgba(15, 118, 110, 0.12)"
          bg="rgba(255, 255, 255, 0.82)"
          boxShadow="panel"
          p="5"
        >
          <Text color="textMuted">{t('pleaseAddGuestFirst')}</Text>
        </Box>
      ) : availableRooms.length === 0 ? (
        <Box
          mt="6"
          rounded="3xl"
          border="1px solid"
          borderColor="rgba(15, 118, 110, 0.12)"
          bg="rgba(255, 255, 255, 0.82)"
          boxShadow="panel"
          p="5"
        >
          <Text color="textMuted">{t('noAvailableRooms')}</Text>
        </Box>
      ) : (
        <Box
          mt="6"
          bg="rgba(255, 255, 255, 0.82)"
          rounded="3xl"
          border="1px solid"
          borderColor="rgba(15, 118, 110, 0.12)"
          boxShadow="panel"
          backdropFilter="blur(16px)"
          p={{ base: '5', md: '6' }}
        >
          <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
            {t('createContractTitle')}
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4" mt="5">
              <Box>
                <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                  {t('selectGuest')}
                </Text>
                <select {...register('guestId')} className={selectClassName}>
                  <option value="">{t('pleaseSelect')}</option>
                  {guests.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.firstName} {guest.lastName}
                    </option>
                  ))}
                </select>
                <FormErrorText
                  message={errors.guestId?.message ? t(errors.guestId.message) : ''}
                />
              </Box>

              <Box>
                <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                  {t('selectRoom')}
                </Text>
                <select {...register('roomId')} className={selectClassName}>
                  <option value="">{t('pleaseSelect')}</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.building}-{room.roomNumber}
                    </option>
                  ))}
                </select>
                <FormErrorText
                  message={errors.roomId?.message ? t(errors.roomId.message) : ''}
                />
              </Box>

              <Box>
                <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                  {t('stayType')}
                </Text>
                <select {...register('stayType')} className={selectClassName}>
                  <option value="DAILY">{t('daily')}</option>
                  <option value="MONTHLY">{t('monthly')}</option>
                </select>
              </Box>

              <Box>
                <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                  {t('price')}
                </Text>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      min="1"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={inputClassName}
                    />
                  )}
                />
                <FormErrorText
                  message={errors.price?.message ? t(errors.price.message) : ''}
                />
              </Box>

              <Box display="grid" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
                <Box>
                  <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                    {t('checkIn')}
                  </Text>
                  <input type="date" {...register('checkInDate')} className={inputClassName} />
                  <FormErrorText
                    message={errors.checkInDate?.message ? t(errors.checkInDate.message) : ''}
                  />
                </Box>

                <Box>
                  <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                    {t('checkOut')}
                  </Text>
                  <input type="date" {...register('checkOutDate')} className={inputClassName} />
                  <FormErrorText
                    message={errors.checkOutDate?.message ? t(errors.checkOutDate.message) : ''}
                  />
                </Box>
              </Box>

              <Box>
                <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                  {t('contractStatus')}
                </Text>
                <select {...register('status')} className={selectClassName}>
                  <option value="ACTIVE">{t('active')}</option>
                  <option value="RESERVED">{t('contractReserved')}</option>
                </select>
              </Box>

              <FormErrorText message={submitError} />

              <Button type="submit" w="full" bg="brandPrimary" color="white" rounded="full" h="12">
                {t('save')}
              </Button>
            </Flex>
          </form>
        </Box>
      )}
    </Box>
  );
}
