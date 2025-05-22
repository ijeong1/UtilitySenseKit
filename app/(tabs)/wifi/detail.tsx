import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function WifiDetailScreen() {
  const params = useLocalSearchParams();

  const ssid = params.ssid ?? 'Unknown SSID';
  const isProtected = params.isProtected === 'true';
  const frequency = params.frequency ?? '';
  const bssid = params.bssid ?? 'Unknown BSSID';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wi-Fi Details</Text>
      <Text style={styles.label}>SSID: <Text style={styles.value}>{ssid}</Text></Text>
      <Text style={styles.label}>Protected: <Text style={styles.value}>{isProtected ? 'Yes' : 'No'}</Text></Text>
      <Text style={styles.label}>Frequency: <Text style={styles.value}>{frequency}</Text></Text>
      <Text style={styles.label}>BSSID: <Text style={styles.value}>{bssid}</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
  },
});
