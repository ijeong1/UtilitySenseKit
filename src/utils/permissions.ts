import * as Location from 'expo-location';
import { Alert } from 'react-native';

export async function getCurrentLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Denied',
      'Permission to access location was denied. Please enable it in settings to get current weather.'
    );
    return null;
  }

  try {
    let location = await Location.getCurrentPositionAsync({});
    return location.coords;
  } catch (error) {
    console.error("Error getting current location:", error);
    Alert.alert(
      'Location Error',
      'Could not retrieve current location. Please check your device settings.'
    );
    return null;
  }
}