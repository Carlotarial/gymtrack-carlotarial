import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  
  useEffect(() => {
    // 🛡️ Solo ejecutamos esto en Android para limpiar la pantalla de botones
    if (Platform.OS === 'android') {
      const setupImmersiveMode = async () => {
        // Oculta la barra de navegación (Atrás, Home, Recientes)
        await NavigationBar.setVisibilityAsync("hidden");
        // Hace que la barra sea "pegajosa": solo aparece al deslizar y se va sola
        await NavigationBar.setBehaviorAsync("overlay-swipe");
      };

      setupImmersiveMode();
    }
  }, []);

  return (
    <ThemeProvider>
      <UserProvider>
        {/* 🕒 Forzamos que la barra superior sea visible y translúcida */}
        <StatusBar style="auto" hidden={false} translucent={true} />
        
        <Stack screenOptions={{ headerShown: false }}>
          {/* Onboarding: El punto de entrada */}
          <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
          
          {/* Tabs Principales */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* Pantallas de flujo de entrenamiento */}
          <Stack.Screen name="routine" options={{ presentation: 'card' }} />
          <Stack.Screen name="workout" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="success" options={{ headerShown: false }} />
        </Stack>
      </UserProvider>
    </ThemeProvider>
  );
}