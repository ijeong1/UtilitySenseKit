import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TabLayout = () => {

    return (
        <Tabs
            screenOptions={{
            tabBarActiveTintColor: 'black',
            headerShown: false,
            }}>
            <Tabs.Screen
            name="weather"
            options={{
                title: 'Weather',
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="cloud-outline" color={color} size={size} />
                ),
            }}
            />
            <Tabs.Screen
            name="wifi"
            options={{
                title: 'WiFi',
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="wifi-outline" color={color} size={size} />
                ),
            }}
            />
            <Tabs.Screen
            name="bluetooth"
            options={{
                title: 'Bluetooth',
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="bluetooth-outline" color={color} size={size} />
                ),
            }}
            />
            <Tabs.Screen
            name="barcode"
            options={{
                title: 'Barcode',
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="barcode-outline" color={color} size={size} />
                ),
            }}
            />
        </Tabs>
    );
}
export default TabLayout;