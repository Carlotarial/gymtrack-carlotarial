import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const state = await AsyncStorage.getItem('@notifications_enabled');
      setIsEnabled(state === 'true');
    } catch (e) {
      console.log('Error al cargar estado de notificaciones');
    }
  };

  const toggleNotifications = async (value: boolean) => {
    try {
      if (value) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Debes permitir las notificaciones en los ajustes de tu dispositivo.');
          return false;
        }
        
        // Programar recordatorio diario a las 18:00
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "¡Es hora de moverse! 🚀",
            body: "Tus objetivos te esperan. ¡Completa tu entrenamiento de hoy!",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 18,
            minute: 0,
          },
        });
        
        setIsEnabled(true);
        await AsyncStorage.setItem('@notifications_enabled', 'true');
        return true;
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        setIsEnabled(false);
        await AsyncStorage.setItem('@notifications_enabled', 'false');
        return true;
      }
    } catch (e) {
      console.error('Error al configurar notificaciones:', e);
      return false;
    }
  };

  return { isEnabled, toggleNotifications };
}
