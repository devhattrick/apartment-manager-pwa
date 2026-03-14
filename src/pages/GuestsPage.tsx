import { Box, Button, Grid, Heading } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormErrorText from '../components/common/FormErrorText';
import { guestSchema, type GuestFormValues } from '../schemas/guestSchema';
import { useApartmentStore } from '../store/useApartmentStore';

export default function GuestsPage() {
  const { t } = useTranslation();
  const { guests, seedMockData, addGuest } = useApartmentStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  const onSubmit = (values: GuestFormValues) => {
    addGuest({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone?.trim() || '',
    });

    reset();
  };

  return (
    <Box>
      <Heading size="lg" color="brandDark">
        {t('guestsTitle')}
      </Heading>

      <Grid templateColumns={{ base: '1fr', xl: '420px 1fr' }} gap="4" mt="6">
        <Box
          bg="white"
          rounded="2xl"
          border="1px solid"
          borderColor="borderSubtle"
          shadow="sm"
          p="5"
        >
          <Heading size="md" mb="4">
            {t('addGuestTitle')}
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('firstName')}
              </label>
              <input
                {...register('firstName')}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              />
              <FormErrorText
                message={errors.firstName?.message ? t(errors.firstName.message) : ''}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('lastName')}
              </label>
              <input
                {...register('lastName')}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              />
              <FormErrorText
                message={errors.lastName?.message ? t(errors.lastName.message) : ''}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('phone')}
              </label>
              <input
                {...register('phone')}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              />
            </div>

            <Button type="submit" w="full" bg="brandPrimary" color="white" rounded="xl">
              {t('save')}
            </Button>
          </form>
        </Box>

        <Box
          bg="white"
          rounded="2xl"
          border="1px solid"
          borderColor="borderSubtle"
          shadow="sm"
          p="5"
        >
          <Heading size="md" mb="4">
            {t('guestsTitle')}
          </Heading>

          <div className="space-y-3">
            {guests.map((guest) => (
              <div key={guest.id} className="rounded-xl border border-slate-200 p-4">
                <div className="font-semibold text-slate-800">
                  {guest.firstName} {guest.lastName}
                </div>
                <div className="text-sm text-slate-500">{guest.phone || '-'}</div>
              </div>
            ))}
          </div>
        </Box>
      </Grid>
    </Box>
  );
}