import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

// Nueva paleta estética: Tonos Pastel Modernos (Violeta Pastel + Peach)
export interface AppColors {
  background: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;          // Color primario pastel (ej. Violeta)
  accentLight: string;     // Fondo suave pastel
  accentDark: string;      // Texto contraste
  gold: string;            // Secundario pastel (ej. Peach/Rosa)
  goldLight: string;       // Fondo suave peach
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonDisabled: string;
  barActive: string;
  barInactive: string;
  tabActive: string;
  tabInactive: string;
  divider: string;
  overlay: string;
}

export const LightColors: AppColors = {
  background: '#F9FAFB',     // Fondo neutro muy suave (F9)
  surface: '#FFFFFF',        // Blanco puro para elevar tarjetas
  surfaceBorder: '#F3F4F6',  // Gris casi invisible
  text: '#111827',           // Pizarra extra oscuro
  textSecondary: '#6B7280',  // Gris medio/suave
  textMuted: '#D1D5DB',      
  accent: '#DDD6FE',         // LAVANDA PASTEL SEDOSO (P-200)
  accentLight: '#F5F3FF',    // Fondo nube lavanda
  accentDark: '#7C3AED',     // Violeta medio para legibilidad
  gold: '#FBCFE8',           // ROSA PASTEL SUAVE (P-200)
  goldLight: '#FDF2F8',      // Fondo rosado clarito
  buttonPrimary: '#C4B5FD',  // Botón Lavanda Soft (P-300)
  buttonPrimaryText: '#4C1D95', // Texto oscuro para máximo contraste 
  buttonDisabled: '#F3F4F6',
  barActive: '#C4B5FD',
  barInactive: '#F3F4F6',
  tabActive: '#8B5CF6',
  tabInactive: '#9CA3AF',
  divider: '#F3F4F6',
  overlay: 'rgba(221, 214, 254, 0.12)', // Overlay teñido pastel
};

export const DarkColors: AppColors = {
  background: '#12121A',     // NEGRO LAVANDA PROFUNDO (Suave y mate)
  surface: '#1C1C2B',        // Tarjetas profundas pero lavandas
  surfaceBorder: '#2D2D44',  // Borde sutil
  text: '#F8FAFC',           // Blanco mate con toque azul
  textSecondary: '#A5A6C2',  // Texto secundario desaturado
  textMuted: '#58557D',      
  accent: '#B0A2F2',         // LAVANDA MATE (Pastel Dark) - No Neón
  accentLight: '#2E2E44',    // Fondo profundo mate
  accentDark: '#E0D7FF',     // Texto contraste lavanda
  gold: '#FBCFE8',           // Rosa pastel suave
  goldLight: '#4A2A3A',      // Fondo profundo granate/rosa
  buttonPrimary: '#B0A2F2',  // Botón lavanda profundo y mate
  buttonPrimaryText: '#12121A', // Texto oscuro para legibilidad
  buttonDisabled: '#2D2D44',
  barActive: '#B0A2F2',
  barInactive: '#2D2D44',
  tabActive: '#B0A2F2',
  tabInactive: '#6B7280',
  divider: '#2D2D44',
  overlay: 'rgba(176, 162, 242, 0.08)',
};

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colors: AppColors;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: LightColors,
  mode: 'system',
  isDark: false,
  setMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem('@theme_mode').then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setModeState(saved);
      }
    });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem('@theme_mode', newMode);
  };

  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark');

  const colors = isDark ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ colors, mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
