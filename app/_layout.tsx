import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox, Platform } from 'react-native';

LogBox.ignoreLogs([
  '[Reanimated]',        
  'shadow*',             
  'props.pointerEvents', 
  '[expo-notifications]',
  'Selected easing is not currently supported on web' 
]);

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
    <UserProvider>
      <ThemeProvider>
        <StatusBar style="auto" hidden={false} translucent={true} />
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
          
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          <Stack.Screen name="routine" options={{ presentation: 'card' }} />
          <Stack.Screen name="workout" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="success" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </UserProvider>
  );
}