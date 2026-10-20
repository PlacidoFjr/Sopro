import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useDevotionalStore } from '../../src/context/devotional-store';
import { colors, darkColors } from '../../src/theme';

export default function TabLayout() {
  const { preferences } = useDevotionalStore();
  const palette = preferences.appearance === 'dark' ? darkColors : colors;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.ink,
        tabBarInactiveTintColor: palette.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 0 },
        tabBarStyle: {
          backgroundColor: palette.white,
          borderTopColor: palette.line,
          height: 82,
          width: '100%',
          maxWidth: 900,
          alignSelf: 'center',
          paddingTop: 5,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoje',
          tabBarIcon: ({ color }) => <Text accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ color, fontSize: 20, lineHeight: 24 }}>◉</Text>,
        }}
      />
      <Tabs.Screen
        name="leituras"
        options={{
          title: 'Leituras',
          tabBarIcon: ({ color }) => <Text accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ color, fontSize: 19, lineHeight: 24 }}>▤</Text>,
        }}
      />
      <Tabs.Screen
        name="caderno"
        options={{
          title: 'Caderno',
          tabBarIcon: ({ color }) => <Text accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ color, fontSize: 20, lineHeight: 24 }}>✎</Text>,
        }}
      />
      <Tabs.Screen
        name="salvos"
        options={{
          title: 'Salvos',
          tabBarIcon: ({ color }) => <Text accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ color, fontSize: 23, lineHeight: 24 }}>♡</Text>,
        }}
      />
    </Tabs>
  );
}
