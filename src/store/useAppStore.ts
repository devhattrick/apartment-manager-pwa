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

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      language: (localStorage.getItem('app-lang') as Language) || 'th',

      login: (email: string) =>
        set({
          isAuthenticated: true,
          user: {
            email,
            name: 'Operator',
          },
        }),

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