import { useUser } from '@/hooks/useUser';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function StartPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#504DE4" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/(client)/home" />;
  }
  return <Redirect href="/(tabs)/(introduce)" />;
}