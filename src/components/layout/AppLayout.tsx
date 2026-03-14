import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useAppStore } from '../../store/useAppStore';

const navItems = [
  { to: '/dashboard', key: 'dashboard', end: true },
  { to: '/rooms', key: 'rooms', end: true },
  { to: '/rooms/block', key: 'roomBlock', end: true },
  { to: '/guests', key: 'guests', end: true },
  { to: '/contracts', key: 'contracts' },
  { to: '/reports', key: 'reports', end: true },
];

function NavigationLink({
  to,
  label,
  compact = false,
  end = false,
}: {
  to: string;
  label: string;
  compact?: boolean;
  end?: boolean;
}) {
  return (
    <NavLink key={to} to={to} end={end}>
      {({ isActive }) => (
        <Box
          position="relative"
          overflow="hidden"
          px={compact ? '3' : '4'}
          py={compact ? '2.5' : '3'}
          borderRadius="2xl"
          bg={isActive ? 'rgba(15, 118, 110, 0.12)' : 'transparent'}
          color={isActive ? 'brandDark' : 'textMuted'}
          border="1px solid"
          borderColor={isActive ? 'rgba(15, 118, 110, 0.18)' : 'transparent'}
          transition="all 0.2s ease"
          _before={{
            content: '""',
            position: 'absolute',
            left: '0',
            top: compact ? '8px' : '10px',
            bottom: compact ? '8px' : '10px',
            width: isActive ? '4px' : '0',
            borderRadius: '999px',
            bg: 'brandPrimary',
            transition: 'width 0.2s ease',
          }}
          _hover={{
            bg: isActive ? 'rgba(15, 118, 110, 0.12)' : 'rgba(255, 255, 255, 0.68)',
            color: 'brandDark',
            borderColor: 'rgba(15, 118, 110, 0.12)',
          }}
        >
          <Text
            pl={isActive ? '3' : compact ? '0' : '1'}
            fontSize={compact ? 'sm' : 'md'}
            fontWeight={isActive ? 'semibold' : 'medium'}
          >
            {label}
          </Text>
        </Box>
      )}
    </NavLink>
  );
}

export default function AppLayout() {
  const { t } = useTranslation();
  const { logout, setLanguage, language, user } = useAppStore();

  const changeLanguage = (lang: 'th' | 'en') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Box minH="100vh" bg="transparent">
      <Flex minH="100vh" align="stretch">
        <Box
          display={{ base: 'none', lg: 'block' }}
          w="300px"
          px="6"
          py="6"
        >
          <Box
            h="full"
            rounded="3xl"
            border="1px solid"
            borderColor="rgba(15, 118, 110, 0.12)"
            bg="rgba(255, 255, 255, 0.62)"
            backdropFilter="blur(18px)"
            p="5"
          >
            <Box
              rounded="3xl"
              p="5"
              color="white"
              bg="linear-gradient(145deg, #0E3E4A 0%, #0F766E 58%, #6CC9BD 100%)"
              boxShadow="panel"
            >
              <Flex align="center" gap="3">
                <Flex
                  w="11"
                  h="11"
                  rounded="2xl"
                  align="center"
                  justify="center"
                  bg="rgba(255, 255, 255, 0.16)"
                  fontWeight="bold"
                  letterSpacing="0.08em"
                >
                  AM
                </Flex>
                <Box>
                  <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.18em" color="whiteAlpha.700">
                    Property OS
                  </Text>
                  <Text mt="1" fontSize="xl" fontWeight="bold">
                    {t('appName')}
                  </Text>
                </Box>
              </Flex>

              <Text mt="4" fontSize="sm" lineHeight="1.7" color="whiteAlpha.800">
                {t('appTagline')}
              </Text>
            </Box>

            <Box
              mt="5"
              rounded="2xl"
              border="1px solid"
              borderColor="rgba(15, 118, 110, 0.12)"
              bg="rgba(255, 255, 255, 0.72)"
              p="4"
            >
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.14em" color="textMuted">
                {t('signedInAs')}
              </Text>
              <Text mt="2" fontSize="lg" fontWeight="semibold" color="brandDark">
                {user?.name ?? t('operatorRole')}
              </Text>
              <Text mt="1" fontSize="sm" color="textMuted">
                {user?.email ?? 'demo@apartment.com'}
              </Text>
            </Box>

            <Box mt="7">
              <Text
                px="2"
                pb="3"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="0.18em"
                color="textMuted"
                textTransform="uppercase"
              >
                {t('navigation')}
              </Text>
              <Flex direction="column" gap="2">
                {navItems.map((item) => (
                  <NavigationLink
                    key={item.to}
                    to={item.to}
                    label={t(item.key)}
                    end={item.end}
                  />
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>

        <Box flex="1" minW="0">
          <Box maxW="1560px" mx="auto" px={{ base: '4', md: '6', xl: '8' }} py={{ base: '4', md: '5' }}>
            <Flex
              as="header"
              justify="space-between"
              align="center"
              gap="4"
              px={{ base: '4', md: '5' }}
              py="4"
              rounded="3xl"
              bg="rgba(255, 255, 255, 0.72)"
              border="1px solid"
              borderColor="rgba(15, 118, 110, 0.12)"
              boxShadow="float"
              backdropFilter="blur(18px)"
              position="sticky"
              top={{ base: '4', md: '5' }}
              zIndex="20"
            >
              <Box minW="0">
                <Text fontSize="xs" letterSpacing="0.18em" textTransform="uppercase" color="brandPrimary">
                  {t('appName')}
                </Text>
                <Text mt="1" fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold" color="brandDark" truncate>
                  {user?.name ?? t('operatorRole')}
                </Text>
                <Text fontSize="sm" color="textMuted" truncate>
                  {user?.email ?? 'demo@apartment.com'}
                </Text>
              </Box>

              <HStack gap="2" flexShrink={0}>
                <Button
                  size="sm"
                  rounded="full"
                  px="4"
                  border="1px solid"
                  borderColor={language === 'th' ? 'brandDark' : 'rgba(15, 118, 110, 0.14)'}
                  bg={language === 'th' ? 'brandDark' : 'rgba(255, 255, 255, 0.6)'}
                  color={language === 'th' ? 'white' : 'brandDark'}
                  _hover={{ bg: language === 'th' ? 'brandDark' : 'rgba(255, 255, 255, 0.92)' }}
                  onClick={() => changeLanguage('th')}
                >
                  TH
                </Button>
                <Button
                  size="sm"
                  rounded="full"
                  px="4"
                  border="1px solid"
                  borderColor={language === 'en' ? 'brandDark' : 'rgba(15, 118, 110, 0.14)'}
                  bg={language === 'en' ? 'brandDark' : 'rgba(255, 255, 255, 0.6)'}
                  color={language === 'en' ? 'white' : 'brandDark'}
                  _hover={{ bg: language === 'en' ? 'brandDark' : 'rgba(255, 255, 255, 0.92)' }}
                  onClick={() => changeLanguage('en')}
                >
                  EN
                </Button>
                <Button
                  size="sm"
                  rounded="full"
                  px={{ base: '3', md: '4' }}
                  border="1px solid"
                  borderColor="rgba(180, 35, 24, 0.12)"
                  bg="rgba(244, 67, 54, 0.08)"
                  color="#B42318"
                  _hover={{ bg: 'rgba(244, 67, 54, 0.14)' }}
                  onClick={logout}
                >
                  {t('logout')}
                </Button>
              </HStack>
            </Flex>

            <Box pt={{ base: '5', md: '6' }} pb={{ base: '28', md: '10' }}>
              <Outlet />
            </Box>
          </Box>

          <Box
            display={{ base: 'block', lg: 'none' }}
            position="fixed"
            left="50%"
            bottom="3"
            transform="translateX(-50%)"
            w="calc(100% - 1rem)"
            maxW="720px"
            rounded="3xl"
            border="1px solid"
            borderColor="rgba(15, 118, 110, 0.12)"
            bg="rgba(255, 255, 255, 0.82)"
            backdropFilter="blur(18px)"
            px="3"
            py="3"
            boxShadow="float"
            zIndex="30"
          >
            <Flex gap="2" overflowX="auto">
              {navItems.map((item) => (
                <NavigationLink
                  key={item.to}
                  to={item.to}
                  label={t(item.key)}
                  compact
                  end={item.end}
                />
              ))}
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
