import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarcodeHistoryItem } from '@/types/BarcodeHistoryItem';

const BarcodeScreen = () => {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(Platform.OS === 'ios');
  const cameraRef = useRef(null);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'This app needs camera access to scan barcodes.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasCameraPermission(true);
          } else {
            Alert.alert('Permission Denied', 'Camera permission is required to scan barcodes.');
          }
        } catch {
          Alert.alert('Error', 'Failed to request camera permission.');
        }
      }
    };

    requestPermissions();
  }, []);

  const navigateToHistory = useCallback(() => {
    router.push('/barcode/history');
  }, [router]);

  const onReadCode = (event: any) => {
    const code = event.nativeEvent.codeStringValue;
    setScanning(false);
    if (!code) return;
    addBarcodeToHistory({
      code,
      timestamp: new Date().toISOString(),
    });
    Alert.alert('Barcode Scanned', code);
  };

  const { addBarcodeToHistory } = useHistory('barcodeHistory');

  const handleScanButtonPress = () => {
    if (hasCameraPermission) {
      setScanning(true);
    } else {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed to scan barcodes. Please enable it in app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {hasCameraPermission ? (
        <View style={styles.cameraContainer}>
          {scanning ? (
            <Camera
              ref={cameraRef}
              style={styles.cameraVisible}
              cameraType={CameraType.Back}
              scanBarcode={true}
              onReadCode={onReadCode}
              showFrame={true}
              laserColor="#FF3D00"
              frameColor="#00C853"
            />
          ) : (
            <View style={styles.overlayContent}>
              <Button title="Scan Barcode" onPress={handleScanButtonPress} />
            </View>
          )}
          <View style={styles.bottomButtonContainer}>
            <Button title="View History" onPress={navigateToHistory} />
          </View>
        </View>
      ) : (
        <View style={styles.permissionDeniedContainer}>
          <Text style={styles.permissionText}>Camera permission not granted.</Text>
          {Platform.OS === 'android' && (
            <Button title="Grant Permission" onPress={handleScanButtonPress} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  cameraContainer: { flex: 1 },
  cameraVisible: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  overlayContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonContainer: {
    width: '100%',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  permissionDeniedContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'red',
  },
});

export function useHistory(key: 'barcodeHistory', limit: number = 5) {
  const [history, setHistory] = useState<BarcodeHistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(key);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error(`Failed to load ${key} history:`, e);
      }
    };
    loadHistory();
  }, [key]);

  const addBarcodeToHistory = useCallback(async (item: BarcodeHistoryItem) => {
    try {
      setHistory(prevHistory => {
        const newHistory = [item, ...prevHistory.filter(h => h.code !== item.code)];
        const limitedHistory = newHistory.slice(0, limit);
        AsyncStorage.setItem(key, JSON.stringify(limitedHistory));
        return limitedHistory;
      });
    } catch (e) {
      console.error(`Failed to save ${key} history:`, e);
    }
  }, [key, limit]);

  return {
    barcodeHistory: history,
    addBarcodeToHistory,
  };
}

export default BarcodeScreen;
