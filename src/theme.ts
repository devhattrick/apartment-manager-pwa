import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brandDark: { value: '#0E3E4A' },
        brandPrimary: { value: '#0F766E' },
        brandSoft: { value: '#9ED8D0' },
        brandAccent: { value: '#F4B26D' },
        brandBg: { value: '#EEF4F1' },
        surface: { value: '#FFFFFF' },
        surfaceMuted: { value: '#F7FAF8' },
        textPrimary: { value: '#1A2F36' },
        textMuted: { value: '#647780' },
        borderSubtle: { value: '#D5E2E0' },
        white: { value: '#FFFFFF' },
      },
      shadows: {
        panel: { value: '0 28px 60px -34px rgba(14, 62, 74, 0.24)' },
        float: { value: '0 24px 44px -28px rgba(14, 62, 74, 0.28)' },
      },
    },
  },
  globalCss: {
    'html, body': {
      margin: 0,
      padding: 0,
      background:
        'radial-gradient(circle at top left, rgba(244, 178, 109, 0.16), transparent 34%), linear-gradient(180deg, #f7f4ec 0%, #edf4f2 35%, #eef6f3 100%)',
      color: '{colors.textPrimary}',
    },
    '*': {
      boxSizing: 'border-box',
    },
  },
});

export const system = createSystem(defaultConfig, config);
