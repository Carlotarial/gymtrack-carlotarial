import { useUser } from '@/context/UserContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isOnboarded, isLoading } = useUser();

  // Mientras carga los datos de AsyncStorage, mostramos un loader
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFBF6' }}>
        <ActivityIndicator size="small" color="#9CAF88" />
      </View>
    );
  }

  // Si ya completó onboarding, va directo al dashboard
  if (isOnboarded) {
    return <Redirect href={'/(tabs)' as any} />;
  }

  // Si es nuevo, arranca el onboarding
  return <Redirect href={'/onboarding' as any} />;
}