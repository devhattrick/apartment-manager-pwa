import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormErrorText from '../components/common/FormErrorText';
import { guestSchema, type GuestFormValues } from '../schemas/guestSchema';
import { useApartmentStore } from '../store/useApartmentStore';

const fieldClassName = 'app-input';

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
      <Text mt="2" color="textMuted">
        {guests.length} {t('guests')}
      </Text>

      <Grid templateColumns={{ base: '1fr', xl: '420px 1fr' }} gap="5" mt="6">
        <Box
          bg="rgba(255, 255, 255, 0.82)"
          rounded="3xl"
          border="1px solid"
          borderColor="rgba(15, 118, 110, 0.12)"
          boxShadow="panel"
          backdropFilter="blur(16px)"
          p={{ base: '5', md: '6' }}
        >
          <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
            {t('addGuestTitle')}
          </Text>
          <Heading size="md" mt="3" color="brandDark">
            {t('addGuestTitle')}
          </Heading>

          <Box mt="5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                    {t('firstName')}
                  </Text>
                  <input {...register('firstName')} className={fieldClassName} />
                  <FormErrorText
                    message={errors.firstName?.message ? t(errors.firstName.message) : ''}
                  />
                </Box>

                <Box>
                  <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                    {t('lastName')}
                  </Text>
                  <input {...register('lastName')} className={fieldClassName} />
                  <FormErrorText
                    message={errors.lastName?.message ? t(errors.lastName.message) : ''}
                  />
                </Box>

                <Box>
                  <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                    {t('phone')}
                  </Text>
                  <input {...register('phone')} className={fieldClassName} />
                </Box>

                <Button type="submit" w="full" bg="brandPrimary" color="white" rounded="full" h="12">
                  {t('save')}
                </Button>
              </Flex>
            </form>
          </Box>
        </Box>

        <Box
          bg="rgba(255, 255, 255, 0.82)"
          rounded="3xl"
          border="1px solid"
          borderColor="rgba(15, 118, 110, 0.12)"
          boxShadow="panel"
          backdropFilter="blur(16px)"
          p={{ base: '5', md: '6' }}
        >
          <Flex align="center" justify="space-between" gap="3" wrap="wrap">
            <Box>
              <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
                {t('guestsTitle')}
              </Text>
              <Heading size="md" mt="3" color="brandDark">
                {t('guestsTitle')}
              </Heading>
            </Box>
            <Text color="textMuted">
              {guests.length} {t('guests')}
            </Text>
          </Flex>

          <Flex direction="column" gap="3" mt="5">
            {guests.map((guest) => (
              <Box
                key={guest.id}
                rounded="2xl"
                border="1px solid"
                borderColor="rgba(15, 118, 110, 0.1)"
                bg="surfaceMuted"
                p="4"
              >
                <Text fontSize="lg" fontWeight="semibold" color="brandDark">
                  {guest.firstName} {guest.lastName}
                </Text>
                <Text mt="2" color="textMuted">
                  {guest.phone || '-'}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
}
