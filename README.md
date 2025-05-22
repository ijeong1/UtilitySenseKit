# UtilitySenseKit

A React Native mobile app built with Expo, providing utility tools such as Weather, WiFi, Bluetooth, and Barcode scanning in a single interface.

## Features

- **Weather**: View current weather and forecast for your location.
- **WiFi**: Scan and display nearby WiFi networks.
- **Bluetooth**: Scan for nearby Bluetooth devices, connect, and view their services and characteristics (using `react-native-ble-plx`).
- **Barcode Scanner**: Scan barcodes and maintain a history of the last 5 scans (using `react-native-camera-kit`).

## Getting Started

### Prerequisites
- Node.js & npm
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS) or Android Studio (for Android)

### Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd UtilitySenseKit
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Install required native modules:
   ```sh
   npm install react-native-ble-plx react-native-camera-kit
   ```
4. For iOS, install CocoaPods:
   ```sh
   cd ios && pod install && cd ..
   ```

### Running the App
- Start the Expo development server:
  ```sh
  npm start
  ```
- Use the Expo Go app or an emulator/simulator to run the app.

## Permissions
- **Camera**: Required for barcode scanning.
- **Bluetooth**: Required for Bluetooth scanning and connection.
- **Location**: May be required for WiFi and Bluetooth scanning on some platforms.

## Project Structure
- `app/` - Main app screens and navigation
- `src/` - Components, hooks, services, and utilities
- `assets/` - Fonts and images

## Notes
- Make sure to grant all required permissions for full functionality.
- For Android, you may need to manually enable permissions in device settings.

## License
MIT
