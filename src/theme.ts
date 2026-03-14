import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brandDark: { value: '#09637E' },
        brandPrimary: { value: '#088395' },
        brandSoft: { value: '#7AB2B2' },
        brandBg: { value: '#EBF4F6' },
        textPrimary: { value: '#1F2937' },
        textMuted: { value: '#6B7280' },
        borderSubtle: { value: '#D9E4E8' },
        white: { value: '#FFFFFF' },
      },
    },
  },
  globalCss: {
    'html, body': {
      margin: 0,
      padding: 0,
      background: '{colors.brandBg}',
      color: '{colors.textPrimary}',
    },
    '*': {
      boxSizing: 'border-box',
    },
  },
});

export const system = createSystem(defaultConfig, config);