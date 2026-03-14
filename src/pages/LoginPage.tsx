import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email.trim() || 'demo@apartment.com');
    navigate('/dashboard');
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      minH="100vh"
      px={{ base: '4', md: '6' }}
      py={{ base: '6', md: '8' }}
      bg="transparent"
    >
      <Flex
        minH="calc(100vh - 3rem)"
        maxW="1200px"
        mx="auto"
        rounded={{ base: '3xl', lg: '4xl' }}
        overflow="hidden"
        border="1px solid"
        borderColor="rgba(15, 118, 110, 0.12)"
        boxShadow="panel"
        bg="rgba(255, 255, 255, 0.68)"
        backdropFilter="blur(16px)"
        direction={{ base: 'column', lg: 'row' }}
      >
        <Box
          flex={{ base: '0', lg: '1.1' }}
          p={{ base: '6', md: '8', lg: '10' }}
          color="white"
          bg="linear-gradient(145deg, #0E3E4A 0%, #0F766E 58%, #7AD2C6 100%)"
        >
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            rounded="2xl"
            px="4"
            py="2"
            bg="rgba(255, 255, 255, 0.14)"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.18em"
            textTransform="uppercase"
          >
            Apartment OS
          </Box>

          <Text mt="6" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" lineHeight="1.05">
            {t('appName')}
          </Text>
          <Text mt="4" maxW="520px" fontSize="lg" lineHeight="1.8" color="whiteAlpha.800">
            {t('appTagline')}
          </Text>

          <Flex mt={{ base: '6', md: '10' }} gap="3" wrap="wrap">
            <Box rounded="2xl" bg="rgba(255, 255, 255, 0.14)" px="4" py="3">
              <Text fontSize="sm" color="whiteAlpha.700">
                {t('rooms')}
              </Text>
              <Text mt="1" fontSize="2xl" fontWeight="bold">
                6
              </Text>
            </Box>

            <Box rounded="2xl" bg="rgba(255, 255, 255, 0.14)" px="4" py="3">
              <Text fontSize="sm" color="whiteAlpha.700">
                {t('contracts')}
              </Text>
              <Text mt="1" fontSize="2xl" fontWeight="bold">
                3
              </Text>
            </Box>

            <Box rounded="2xl" bg="rgba(255, 255, 255, 0.14)" px="4" py="3">
              <Text fontSize="sm" color="whiteAlpha.700">
                {t('guests')}
              </Text>
              <Text mt="1" fontSize="2xl" fontWeight="bold">
                3
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box flex="1" p={{ base: '6', md: '8', lg: '10' }} bg="rgba(248, 251, 250, 0.8)">
          <Text fontSize="xs" fontWeight="bold" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
            {t('login')}
          </Text>
          <Text mt="3" fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" color="brandDark">
            {t('signInButton')}
          </Text>
          <Text mt="3" maxW="460px" color="textMuted" lineHeight="1.7">
            {t('loginSubtitle')}
          </Text>

          <Box
            mt="8"
            rounded="3xl"
            border="1px solid"
            borderColor="rgba(15, 118, 110, 0.12)"
            bg="rgba(255, 255, 255, 0.84)"
            p={{ base: '5', md: '6' }}
          >
            <form onSubmit={onSubmit}>
              <Box>
                <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                  {t('email')}
                </Text>
                <input
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="demo@apartment.com"
                  className="app-input"
                />
              </Box>

              <Box mt="4">
                <Text mb="2" fontSize="sm" fontWeight="medium" color="textMuted">
                  {t('password')}
                </Text>
                <input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="app-input"
                />
              </Box>

              <Box
                mt="5"
                rounded="2xl"
                border="1px solid"
                borderColor="rgba(15, 118, 110, 0.12)"
                bg="rgba(15, 118, 110, 0.06)"
                px="4"
                py="3"
              >
                <Text fontSize="sm" color="brandDark">
                  {t('demoHint')}
                </Text>
              </Box>

              <Button
                type="submit"
                mt="6"
                w="full"
                h="13"
                rounded="full"
                bg="brandDark"
                color="white"
                fontWeight="semibold"
                _hover={{ bg: '#0b3440' }}
              >
                {t('signInButton')}
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
