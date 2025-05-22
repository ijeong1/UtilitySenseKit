import { Stack } from 'expo-router';

export default function WeatherLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Weather' }} />
      <Stack.Screen name="history" options={{ title: 'Weather History' }} />
    </Stack>
  );
}