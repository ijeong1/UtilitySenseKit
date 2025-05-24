import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { BleManager, Device, Service, Characteristic } from 'react-native-ble-plx';

const manager = new BleManager();

const BluetoothScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);

  useEffect(() => {
    return () => {
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      const allGranted = Object.values(granted).every(status => status === PermissionsAndroid.RESULTS.GRANTED);
      if (!allGranted) {
        Alert.alert('Permission Required', 'Bluetooth and location permissions are required.');
        return false;
      }
    } else {
      // On iOS, setting the required keys in Info.plist is enough to trigger the BLE permission prompt automatically
    }
    return true;
  };

  const scanningRef = useRef(false);
  const startScan = async () => {
  const permissionGranted = await requestPermissions();
  if (!permissionGranted) return;

  setDevices([]);
  setScanning(true);
  scanningRef.current = true;

  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      Alert.alert('Scan error', error.message);
      setScanning(false);
      scanningRef.current = false;
      return;
    }
    if (device) {
      setDevices(prev => {
        if (prev.find(d => d.id === device.id)) return prev;
        const newList = [...prev, device];
        if (newList.length >= 20) {
          manager.stopDeviceScan();
          setScanning(false);
          scanningRef.current = false;
        }
        return newList;
      });
    }
  });

  setTimeout(() => {
    if (scanningRef.current) {
      manager.stopDeviceScan();
      setScanning(false);
      scanningRef.current = false;
    }
  }, 10000);
};

  const connectToDevice = async (device: Device) => {
    setScanning(false);
    manager.stopDeviceScan();
    try {
      const connected = await device.connect();
      setConnectedDevice(connected);
      await connected.discoverAllServicesAndCharacteristics();
      const svcs = await connected.services();
      setServices(svcs);
      if (svcs.length > 0) {
        const chars = await connected.characteristicsForService(svcs[0].uuid);
        setCharacteristics(chars);
      }
    } catch (e: any) {
      Alert.alert('Connection error', e.message);
    }
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
      <Text>{item.name || 'Unnamed Device'} ({item.id})</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!connectedDevice ? (
        <>
          <Button title={scanning ? 'Scanning...' : 'Scan for Devices'} onPress={startScan} disabled={scanning} />
          {scanning && <ActivityIndicator style={{ margin: 10 }} />}
          <FlatList
            data={devices}
            keyExtractor={item => item.id}
            renderItem={renderDevice}
            ListEmptyComponent={<Text>No devices found</Text>}
          />
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>Connected to: {connectedDevice.name || connectedDevice.id}</Text>
          <Text style={styles.header}>Services:</Text>
          {services.map(service => (
            <View key={service.uuid} style={styles.serviceItem}>
              <Text>Service UUID: {service.uuid}</Text>
              <Text>Characteristics:</Text>
              {characteristics.map(char => (
                <Text key={char.uuid} style={styles.charItem}>- {char.uuid}</Text>
              ))}
            </View>
          ))}
          <Button title="Disconnect" onPress={async () => {
            await connectedDevice.cancelConnection();
            setConnectedDevice(null);
            setServices([]);
            setCharacteristics([]);
          }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  deviceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 8,
  },
  serviceItem: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  charItem: {
    marginLeft: 12,
    fontSize: 13,
  },
});

export default BluetoothScreen;