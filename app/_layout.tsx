import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  
  useEffect(() => {
    if (Platform.OS === 'android') {
      const setupImmersiveMode = async () => {
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("overlay-swipe");
      };

      setupImmersiveMode();
    }
  }, []);

  return (
    <ThemeProvider>
      <UserProvider>
        <StatusBar style="auto" hidden={false} translucent={true} />
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
          
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          <Stack.Screen name="routine" options={{ presentation: 'card' }} />
          <Stack.Screen name="workout" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="success" options={{ headerShown: false }} />
        </Stack>
      </UserProvider>
    </ThemeProvider>
  );
}