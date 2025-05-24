import { Stack } from 'expo-router';

export default function BarcodeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Barcode' }} />
      <Stack.Screen name="history" options={{ title: 'Barcode History' }} />
    </Stack>
  );
}