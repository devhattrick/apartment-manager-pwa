import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'th' | 'en';

type User = {
  email: string;
  name: string;
};

type AppState = {
  isAuthenticated: boolean;
  user: User | null;
  language: Language;
  login: (email: string) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
};

function normalizeEmail(email: string) {
  const trimmed = email.trim();

  if (!trimmed || !trimmed.includes('@')) {
    return 'demo@apartment.com';
  }

  return trimmed.toLowerCase();
}

function toDisplayName(email: string) {
  const localPart = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim();

  if (!localPart) {
    return 'Operator';
  }

  return localPart
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      language: (localStorage.getItem('app-lang') as Language) || 'th',

      login: (email: string) => {
        const normalizedEmail = normalizeEmail(email);

        set({
          isAuthenticated: true,
          user: {
            email: normalizedEmail,
            name: toDisplayName(normalizedEmail),
          },
        });
      },

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),

      setLanguage: (lang) => {
        localStorage.setItem('app-lang', lang);
        set({ language: lang });
      },
    }),
    {
      name: 'apartment-manager-storage',
    }
  )
);
