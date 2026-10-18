import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { DevotionalStoreProvider, useDevotionalStore } from '../src/context/devotional-store';
import { colors, darkColors } from '../src/theme';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DevotionalStoreProvider>
        <AppShell />
      </DevotionalStoreProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { preferences } = useDevotionalStore();
  const palette = preferences.appearance === 'dark' ? darkColors : colors;

  return (
    <>
        <NotificationNavigation />
        <StatusBar style={preferences.appearance === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.paper },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="devocional" options={{ presentation: 'card' }} />
          <Stack.Screen name="preferencias" options={{ presentation: 'card' }} />
        </Stack>
    </>
  );
}

function NotificationNavigation() {
  const router = useRouter();
  const handledIdentifier = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const openReading = (notification: Notifications.Notification) => {
      if (notification.request.content.data?.kind !== 'daily-devotional-reminder') return;
      if (handledIdentifier.current === notification.request.identifier) return;
      handledIdentifier.current = notification.request.identifier;
      router.replace('/');
      Notifications.clearLastNotificationResponse();
    };

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse?.notification) openReading(lastResponse.notification);
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      openReading(response.notification);
    });
    return () => subscription.remove();
  }, [router]);

  return null;
}
