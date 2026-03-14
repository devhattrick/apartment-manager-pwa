import { Box, Button, Heading, Text } from '@chakra-ui/react';
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
    <Box maxW="720px">
      <Button variant="outline" rounded="xl" onClick={() => navigate('/contracts')}>
        {t('backToContracts')}
      </Button>

      <Heading size="lg" color="brandDark" mt="4">
        {t('createContractTitle')}
      </Heading>

      {guests.length === 0 ? (
        <Text mt="4" color="textMuted">
          {t('pleaseAddGuestFirst')}
        </Text>
      ) : availableRooms.length === 0 ? (
        <Text mt="4" color="textMuted">
          {t('noAvailableRooms')}
        </Text>
      ) : (
        <Box
          mt="6"
          bg="white"
          rounded="2xl"
          border="1px solid"
          borderColor="borderSubtle"
          shadow="sm"
          p="5"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('selectGuest')}
              </label>
              <select
                {...register('guestId')}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              >
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
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('selectRoom')}
              </label>
              <select
                {...register('roomId')}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              >
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
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('stayType')}
              </label>
              <select
                {...register('stayType')}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              >
                <option value="DAILY">{t('daily')}</option>
                <option value="MONTHLY">{t('monthly')}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('price')}
              </label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    min="1"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                  />
                )}
              />
              <FormErrorText
                message={errors.price?.message ? t(errors.price.message) : ''}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t('checkIn')}
                </label>
                <input
                  type="date"
                  {...register('checkInDate')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                />
                <FormErrorText
                  message={errors.checkInDate?.message ? t(errors.checkInDate.message) : ''}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t('checkOut')}
                </label>
                <input
                  type="date"
                  {...register('checkOutDate')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                />
                <FormErrorText
                  message={errors.checkOutDate?.message ? t(errors.checkOutDate.message) : ''}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('contractStatus')}
              </label>
              <select
                {...register('status')}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              >
                <option value="ACTIVE">{t('active')}</option>
                <option value="RESERVED">{t('contractReserved')}</option>
              </select>
            </div>

            <FormErrorText message={submitError} />

            <Button type="submit" w="full" bg="brandPrimary" color="white" rounded="xl">
              {t('save')}
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
}