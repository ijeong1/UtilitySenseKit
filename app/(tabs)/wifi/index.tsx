import React, { useState, useCallback, useEffect } from 'react';
import {
    View, Text, StyleSheet, Button, Alert, TextInput,
    ScrollView, Platform, PermissionsAndroid,
    ActivityIndicator, TouchableOpacity, Modal,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import { useRouter } from 'expo-router';

export default function WifiConnectionScreen() {
    const router = useRouter();
    const [scannedNetworks, setScannedNetworks] = useState<any[]>([]);
    const [currentSSID, setCurrentSSID] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedSSID, setSelectedSSID] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        requestLocationPermission();
        getCurrentConnectedSSID();
    }, []);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission for Wi-Fi',
                        message: 'This app needs location access to scan for Wi-Fi networks.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    if (Platform.Version >= 33) {
                        const grantedNearby = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
                            {
                                title: 'Nearby Wi-Fi Devices Permission',
                                message: 'This app needs permission to access nearby Wi-Fi devices.',
                                buttonNeutral: 'Ask Me Later',
                                buttonNegative: 'Cancel',
                                buttonPositive: 'OK',
                            },
                        );
                        if (grantedNearby !== PermissionsAndroid.RESULTS.GRANTED) {
                            Alert.alert('Permission Denied', 'Cannot connect to Wi-Fi on Android 13+ without Nearby Wi-Fi Devices permission.');
                        }
                    }
                } else {
                    Alert.alert('Permission Denied', 'Cannot scan for Wi-Fi networks without location permission.');
                }
            } catch (err) {
                Alert.alert('Permission Error', `An error occurred while requesting permissions: ${err}`);
            }
        }
    };

    const scanWifiNetworks = useCallback(async () => {
        setIsScanning(true);
        try {
            const networks = await WifiManager.loadWifiList();
            setScannedNetworks(networks.map(net => ({
                ssid: net.SSID,
                capabilities: net.capabilities
            })));
        } catch (error: any) {
            Alert.alert('Scan Failed', `Could not scan for Wi-Fi networks: ${error.message}`);
        } finally {
            setIsScanning(false);
        }
    }, []);

    const getCurrentConnectedSSID = async () => {
        try {
            const ssid = await WifiManager.getCurrentWifiSSID();
            setCurrentSSID(ssid);
        } catch (error: any) {
            setCurrentSSID(null);
        }
    };

    async function getWifiInfoAndNavigate(isProtected:boolean, ssid:string) {
        try {
            const frequency = await WifiManager.getCurrentSignalStrength();
            const bssid = await WifiManager.getBSSID();

            router.push({
                pathname: '/wifi/detail',
                params: {
                    ssid: ssid,
                    isProtected: isProtected ? 'true' : 'false',
                    frequency: frequency?.toString() || '',
                    bssid: bssid || '',
                },
            });
        } catch (error) {
            console.error('Error getting WiFi info:', error);
        }
    }

    const connectToWifi = useCallback(async (ssid: string, isProtected: boolean, password: string = '') => {
        try {
            if (isProtected) {
                await WifiManager.connectToProtectedSSID(ssid, password, false, true);
            } else {
                await WifiManager.connectToSSID(ssid);
            }
            Alert.alert('Connection Successful', `Connected to '${ssid}'.`);
            getCurrentConnectedSSID();
            getWifiInfoAndNavigate(isProtected, ssid);
        } catch (connectError: any) {
            Alert.alert('Connection Failed', `Error during Wi-Fi connection: ${connectError.message || 'Unknown error'}`);
        }
    }, []);

    const isNetworkProtected = (capabilities: string): boolean => {
        return capabilities.includes('WPA') || capabilities.includes('WEP') || capabilities.includes('EAP') || capabilities.includes('PSK');
    };

    const handleNetworkPress = (ssid: string, isProtected: boolean) => {
        if (Platform.OS === 'android') {
            if (isProtected) {
                setSelectedSSID(ssid);
                setPassword('');
                setShowPasswordModal(true);
            } else {
                connectToWifi(ssid, isProtected);
            }
        }
        // iOS: no list interaction allowed, do nothing
    };

    return (
        <View style={styles.container}>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Connection:</Text>
                <Text style={styles.infoText}>
                    {currentSSID ? `Connected to: ${currentSSID}` : 'Not connected to Wi-Fi'}
                </Text>
                <Button title="Refresh Current SSID" onPress={getCurrentConnectedSSID} />
            </View>

            {Platform.OS === 'android' ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Networks:</Text>
                    <Button title="Scan for Networks" onPress={scanWifiNetworks} disabled={isScanning} />
                    {isScanning && <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 10 }} />}
                    <ScrollView style={styles.networkList}>
                        {scannedNetworks.length > 0 ? (
                            scannedNetworks.map((network, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.networkItem}
                                    onPress={() => handleNetworkPress(network.ssid, isNetworkProtected(network.capabilities))}
                                >
                                    <Text style={styles.networkName}>{network.ssid}</Text>
                                    <Text style={styles.networkSecurity}>
                                        {isNetworkProtected(network.capabilities) ? 'Protected' : 'Open'}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.infoText}>No networks found. Tap "Scan for Networks".</Text>
                        )}
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Wi-Fi Scanning</Text>
                    <Text style={styles.infoText}>
                        Wi-Fi scanning is not supported on iOS due to Apple policy.
                    </Text>
                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Current SSID:</Text>
                    <Text style={styles.infoText}>{currentSSID || 'Unavailable'}</Text>
                </View>
            )}

            {/* Password Modal - Android only */}
            {Platform.OS === 'android' && (
                <Modal visible={showPasswordModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Enter Password for "{selectedSSID}"</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Password"
                                secureTextEntry
                                style={[styles.input, { color: '#000' }]}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button title="Cancel" onPress={() => setShowPasswordModal(false)} />
                                <Button
                                    title="Connect"
                                    onPress={() => {
                                        setShowPasswordModal(false);
                                        connectToWifi(selectedSSID, true, password);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    section: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
    },
    networkList: {
        maxHeight: 300,
        marginTop: 10,
    },
    networkItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    networkName: {
        fontSize: 16,
        fontWeight: '600',
    },
    networkSecurity: {
        fontSize: 14,
        color: '#888',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
