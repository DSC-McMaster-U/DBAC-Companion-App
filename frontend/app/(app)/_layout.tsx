import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/components/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  // **Prevent rendering the navigation stack until authentication is resolved**
  if (loading || user === undefined) {
    return null; // This prevents any screen flickering
  }

  if(!user)
    return ( <Redirect href="/main" /> );

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
