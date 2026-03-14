import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
};

function isStandaloneMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
  );
}

export default function PwaBanner() {
  const { t } = useTranslation();
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installDismissed, setInstallDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(isStandaloneMode);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW();

  const syncStandaloneMode = useEffectEvent(() => {
    setIsStandalone(isStandaloneMode());
  });

  useEffect(() => {
    syncStandaloneMode();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallDismissed(false);
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setPromptEvent(null);
      setInstallDismissed(true);
      syncStandaloneMode();
    };

    const handleDisplayModeChange = () => {
      syncStandaloneMode();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [syncStandaloneMode]);

  const activeBanner = useMemo(() => {
    if (needRefresh) {
      return {
        key: 'update',
        title: t('pwaUpdateTitle'),
        description: t('pwaUpdateBody'),
        primaryLabel: t('updateNow'),
        secondaryLabel: t('later'),
        primaryAction: async () => {
          await updateServiceWorker(true);
        },
        secondaryAction: () => setNeedRefresh(false),
      };
    }

    if (promptEvent && !isStandalone && !installDismissed) {
      return {
        key: 'install',
        title: t('pwaInstallTitle'),
        description: t('pwaInstallBody'),
        primaryLabel: t('installApp'),
        secondaryLabel: t('dismiss'),
        primaryAction: async () => {
          await promptEvent.prompt();
          const choice = await promptEvent.userChoice;

          if (choice.outcome === 'accepted') {
            setPromptEvent(null);
            setInstallDismissed(true);
          }
        },
        secondaryAction: () => setInstallDismissed(true),
      };
    }

    if (offlineReady) {
      return {
        key: 'offline-ready',
        title: t('pwaOfflineReadyTitle'),
        description: t('pwaOfflineReadyBody'),
        primaryLabel: t('dismiss'),
        secondaryLabel: null,
        primaryAction: async () => {
          setOfflineReady(false);
        },
        secondaryAction: null,
      };
    }

    return null;
  }, [
    installDismissed,
    isStandalone,
    needRefresh,
    offlineReady,
    promptEvent,
    setNeedRefresh,
    setOfflineReady,
    t,
    updateServiceWorker,
  ]);

  if (!activeBanner) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top={{ base: '3', md: '4' }}
      left="50%"
      transform="translateX(-50%)"
      width={{ base: 'calc(100% - 1rem)', md: 'auto' }}
      maxW="40rem"
      zIndex="1000"
      px="4"
      py="3"
      bg="white"
      border="1px solid"
      borderColor="borderSubtle"
      borderRadius="xl"
      shadow="lg"
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        justify="space-between"
        gap="3"
      >
        <Box>
          <Text fontWeight="semibold" color="brandDark">
            {activeBanner.title}
          </Text>
          <Text mt="1" fontSize="sm" color="textMuted">
            {activeBanner.description}
          </Text>
        </Box>

        <Flex gap="2" justify={{ base: 'flex-end', md: 'flex-start' }}>
          {activeBanner.secondaryLabel ? (
            <Button size="sm" variant="outline" onClick={activeBanner.secondaryAction ?? undefined}>
              {activeBanner.secondaryLabel}
            </Button>
          ) : null}
          <Button
            size="sm"
            bg="brandDark"
            color="white"
            _hover={{ bg: 'brandPrimary' }}
            onClick={activeBanner.primaryAction}
          >
            {activeBanner.primaryLabel}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
