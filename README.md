# UtilitySenseKit

A React Native mobile app built with Expo, offering a suite of utility tools including Weather, WiFi, Bluetooth, and Barcode scanning in a unified interface.

## Features

- **Weather**: Displays current weather and forecast for your location, powered by the [OpenWeatherMap API](https://openweathermap.org/api).
- **WiFi**: Scans and lists nearby WiFi networks, and allows connecting to them (powered by [`react-native-wifi-reborn`](https://github.com/JuanSeBestia/react-native-wifi-reborn)).
- **Bluetooth**: Scans for nearby Bluetooth devices, allows connection, and displays their services and characteristics (powered by `react-native-ble-plx`).
- **Barcode Scanner**: Scans barcodes and keeps a history of the last 5 scans (using `react-native-camera-kit`).

## Getting Started

### Prerequisites
- Node.js & npm
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS) or Android Studio (for Android)

### Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/ijeong1/UtilitySenseKit.git
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
    <details>
        <summary><strong>Optional: Clean, Add, and Reinstall Script</strong></summary>

    This project includes a script, `clean_add_reinstall.sh`, to automate cleanup and reinstallation steps for a fresh setup.

    #### How to Run

    ```sh
    ./clean_add_reinstall.sh
    ```

    If needed, make it executable:

    ```sh
    chmod +x clean_add_reinstall.sh
    ```

    #### What the Script Does

    - Cleans up previous installations and related files.
    - Installs required dependencies.
    - Reinstalls the main application or package.

    This script is helpful for resetting your environment or troubleshooting installation issues.
    </details>
### Running the App
- Start the Expo development server:
  ```sh
  npm start
  ```
- Use the Expo Go app or an emulator/simulator to run the app.

## Permissions
- **Camera**: Needed for barcode scanning.
- **Bluetooth**: Needed for Bluetooth scanning and connections.
- **Location**: May be required for WiFi and Bluetooth scanning on some platforms.
## Platform Specific Permissions

Here's a breakdown of permissions required by UtilitySenseKit on each platform, along with the relevant code files:

### Android

-   **Camera**: Essential for scanning barcodes using `react-native-camera-kit`.
    *   Relevant file: `app/barcode/index.tsx`
-   **Bluetooth**: Required for scanning and connecting to Bluetooth devices via `react-native-ble-plx`.
    *   Relevant file: `app/bluetooth/index.tsx`
-   **Location**: Needed for scanning nearby WiFi networks and Bluetooth devices.  Location permission might require precise location permission depending on the Android version.
    *   Relevant file: `app/wifi/index.tsx`, `app/bluetooth/index.tsx`
    *   Permission check utility: `src/utils/permissions.ts`
    ### Android Manifest Permissions

    Below is a list of permissions that you might need to add to your `AndroidManifest.xml` file, depending on the features you intend to use:

    ```xml
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    ```

    **Note**:
    - The `BLUETOOTH_SCAN` and `BLUETOOTH_CONNECT` permissions are required for Bluetooth functionality on Android 12 and higher.
    - Location permissions (`ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION`) may be necessary for Bluetooth and Wi-Fi scanning, depending on the Android version.
    - Ensure that you request these permissions at runtime using a library like `expo-permissions` or `react-native-permissions`.
### iOS

-   **Camera**: Necessary for barcode scanning functionality.
    *   Relevant file: `app/barcode/index.tsx`
-   **Bluetooth**: Required to discover and connect to Bluetooth devices. The app will request permission to use Bluetooth. Uses `react-native-ble-plx`.
    *   Relevant file: `app/bluetooth/index.tsx`
-   **Location**: Needed for scanning nearby WiFi networks and Bluetooth devices.
    *   Relevant file: `app/wifi/index.tsx`, `app/bluetooth/index.tsx`
    *   Permission check utility: `src/utils/permissions.ts`

    ### Info.plist Permissions

    To configure the necessary permissions on iOS, you need to add specific keys to your `Info.plist` file. Here’s what you need to add:

    ```xml
    <key>NSCameraUsageDescription</key>
    <string>This app needs access to your camera to scan barcodes.</string>
    <key>NSBluetoothAlwaysUsageDescription</key>
    <string>This app needs access to Bluetooth to scan and connect to Bluetooth devices.</string>
    <key>NSBluetoothPeripheralUsageDescription</key>
    <string>This app needs access to Bluetooth to scan and connect to Bluetooth devices.</string>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>This app needs access to your location to scan for nearby Wi-Fi networks and Bluetooth devices.</string>
    ```

    **Explanation**:

    -   `NSCameraUsageDescription`: Describes why the app needs access to the camera.
    -   `NSBluetoothAlwaysUsageDescription`: Describes why the app needs access to Bluetooth.
    -   `NSBluetoothPeripheralUsageDescription`: Describes why the app needs to access Bluetooth.
    -   `NSLocationWhenInUseUsageDescription`: Describes why the app needs access to the user's location when the app is in use.

    **How to Add**:

    1.  Open your project in Xcode.
    2.  Locate the `Info.plist` file in the project navigator.
    3.  Right-click and select "Open As" > "Source Code".
    4.  Add the above XML snippet inside the `<dict>` element.
    5.  Modify the description strings to accurately reflect why your app needs these permissions.


## Environment Variables
Create a `.env` file in the root of your project and add your weather API key like this:
```.env
EXPO_PUBLIC_WEATHER_API_KEY=your_api_key_here
```
Make sure to replace `your_api_key_here` with your actual API key.
This key is required for accessing the weather API in the app.

## Project Structure
<pre>.
├── app/
│   ├── _layout.tsx              # Root layout (required by Expo Router)
│   ├── index.tsx                # Redirects to the /weather screen by default
│
│   ├── barcode/
│   │   ├── _layout.tsx          # Stack layout for barcode screens
│   │   ├── index.tsx            # Barcode scanner screen
│   │   └── history.tsx          # Barcode scan history screen
│
│   ├── bluetooth/
│   │   ├── _layout.tsx          # Stack layout for Bluetooth-related screens
│   │   └── index.tsx            # Bluetooth device scanner screen
│
│   ├── wifi/
│   │   ├── _layout.tsx          # Stack layout for Wi-Fi screens
│   │   └── index.tsx            # Wi-Fi network list screen
│   │   └── detail.tsx            # Wi-Fi detail screen
│
│   ├── weather/
│   │   ├── _layout.tsx          # Stack layout for weather-related screens
│   │   ├── index.tsx            # Weather search screen
│   │   └── history.tsx          # Weather search history screen
│
├── src/
│   ├── components/
│   │   ├── navigation/
│   │   │   └── TabBarIcon.tsx   # Custom icon for bottom tab bar
│   │   └── weather/
│   │       └── ForecastCard.tsx # UI component for weather forecast display
│
│   ├── config/
│   │   └── api.ts               # API keys and base URL configuration
│
│   ├── constants/
│   │   └── colors.ts            # App-wide color constants
│
│   ├── hooks/
│   │   └── useHistory.ts        # Custom hook for managing barcode and weather history (uses AsyncStorage)
│
│   ├── services/
│   │   └── weatherService.ts    # Axios-based module for fetching weather data
│
│   ├── types/
│   │   ├── BarcodeHistoryItem.ts
│   │   ├── ForecastItem.ts
│   │   ├── SearchHistoryItem.ts
│   │   ├── WeatherData.ts
│   │   └── WeatherHistoryItem.ts
│   │                               # TypeScript types for better structure and IntelliSense
│
│   └── utils/
│       └── permissions.ts       # Utility functions for handling platform permissions
 </pre>

## Notes
- Ensure all required permissions are granted for full functionality.
- On Android, you may need to manually enable permissions in device settings.

## Demo
- Android
![App Demo Android](https://github.com/ijeong1/UtilitySenseKit/blob/main/AppDemo_Android.gif)
- iOS
![App Demo iOS](https://github.com/ijeong1/UtilitySenseKit/blob/main/AppDemo_iOS.gif)
## License
MIT
