import { useUser } from '@/context/UserContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isOnboarded, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFBF6' }}>
        <ActivityIndicator size="small" color="#9CAF88" />
      </View>
    );
  }

  if (isOnboarded) {
    return <Redirect href={'/(tabs)' as any} />;
  }

  return <Redirect href={'/onboarding' as any} />;
}