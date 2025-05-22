import { Stack } from 'expo-router';

export default function WifiLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Wifi' }} />
      <Stack.Screen name="detail" options={{ title: 'Wifi Detail' }} />
    </Stack>
  );
}