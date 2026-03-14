import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store/useAppStore";
import i18n from "../../i18n";

const navItems = [
  { to: "/dashboard", key: "dashboard" },
  { to: "/rooms", key: "rooms" },
  { to: "/rooms/block", key: "roomBlock" },
  { to: "/guests", key: "guests" },
  { to: "/contracts", key: "contracts" },
  { to: "/reports", key: "reports" },
];

export default function AppLayout() {
  const { t } = useTranslation();
  const { logout, setLanguage, language } = useAppStore();

  const changeLanguage = (lang: "th" | "en") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Box minH="100vh" bg="brandBg" className="min-h-screen">
      <Flex minH="100vh">
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          bg="white"
          borderTop="1px solid"
          borderColor="borderSubtle"
          px="2"
          py="2"
        >
          <Flex justify="space-around" className="text-sm overflow-x-auto">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {({ isActive }) => (
                  <Text
                    px="2"
                    fontWeight={isActive ? "bold" : "medium"}
                    color={isActive ? "brandPrimary" : "textMuted"}
                    whiteSpace="nowrap"
                  >
                    {t(item.key)}
                  </Text>
                )}
              </NavLink>
            ))}
          </Flex>
        </Box>

        <Box flex="1">
          <Flex
            as="header"
            justify="space-between"
            align="center"
            px={{ base: "4", md: "6" }}
            py="4"
            bg="white"
            borderBottom="1px solid"
            borderColor="borderSubtle"
            position="sticky"
            top="0"
            zIndex="10"
          >
            <Text fontWeight="bold" color="brandDark">
              {t("appName")}
            </Text>

            <HStack gap="2">
              <Button
                size="sm"
                variant={language === "th" ? "solid" : "outline"}
                onClick={() => changeLanguage("th")}
              >
                TH
              </Button>
              <Button
                size="sm"
                variant={language === "en" ? "solid" : "outline"}
                onClick={() => changeLanguage("en")}
              >
                EN
              </Button>
              <Button
                size="sm"
                colorPalette="red"
                variant="subtle"
                onClick={logout}
              >
                {t("logout")}
              </Button>
            </HStack>
          </Flex>

          <Box px={{ base: "4", md: "6" }} py="6" pb={{ base: "24", md: "6" }}>
            <Outlet />
          </Box>

          <Box
            display={{ base: "block", md: "none" }}
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            bg="white"
            borderTop="1px solid"
            borderColor="borderSubtle"
            px="2"
            py="2"
          >
            <Flex justify="space-around" className="text-sm">
              {navItems.slice(0, 4).map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {({ isActive }) => (
                    <Text
                      fontWeight={isActive ? "bold" : "medium"}
                      color={isActive ? "brandPrimary" : "textMuted"}
                    >
                      {t(item.key)}
                    </Text>
                  )}
                </NavLink>
              ))}
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
