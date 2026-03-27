import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useUser } from './UserContext';

export interface AppColors {
  background: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;          
  accentLight: string;     
  accentDark: string;      
  gold: string;            
  goldLight: string;       
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
  background: '#F9FAFB',     
  surface: '#FFFFFF',        
  surfaceBorder: '#F3F4F6',  
  text: '#111827',           
  textSecondary: '#6B7280',  
  textMuted: '#D1D5DB',      
  accent: '#DDD6FE',         
  accentLight: '#F5F3FF',    
  accentDark: '#7C3AED',     
  gold: '#FBCFE8',           
  goldLight: '#FDF2F8',      
  buttonPrimary: '#C4B5FD',  
  buttonPrimaryText: '#4C1D95', 
  buttonDisabled: '#F3F4F6',
  barActive: '#C4B5FD',
  barInactive: '#F3F4F6',
  tabActive: '#8B5CF6',
  tabInactive: '#9CA3AF',
  divider: '#F3F4F6',
  overlay: 'rgba(221, 214, 254, 0.12)', 
};

export const DarkColors: AppColors = {
  background: '#12121A',     
  surface: '#1C1C2B',        
  surfaceBorder: '#2D2D44',  
  text: '#F8FAFC',           
  textSecondary: '#A5A6C2',  
  textMuted: '#58557D',      
  accent: '#B0A2F2',         
  accentLight: '#2E2E44',    
  accentDark: '#E0D7FF',     
  gold: '#FBCFE8',           
  goldLight: '#4A2A3A',      
  buttonPrimary: '#B0A2F2',  
  buttonPrimaryText: '#12121A', 
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
  const { user } = useUser(); 
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    if (user?.theme) {
      setModeState(user.theme);
    }
  }, [user?.name, user?.theme]); 

  useEffect(() => {
    const loadSavedTheme = async () => {
      const saved = await AsyncStorage.getItem('@theme_mode');
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setModeState(saved as ThemeMode);
      }
    };
    loadSavedTheme();
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem('@theme_mode', newMode);
  }, []);

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