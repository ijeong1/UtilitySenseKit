import { Stack } from 'expo-router';

export default function BluetoothLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Bluetooth' }} />
    </Stack>
  );
}