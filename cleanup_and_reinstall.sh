#!/bin/bash

# check the current dicrectory
# cd /Users/ilnamjeong/Dev/mobile/SiemensAssessmentProject/UtilitySenseKit || { echo "Project directory not found or cannot be accessed. Exiting."; exit 1; }

echo "--- Starting React Native project cleanup and reinstallation ---"

echo "1. Deleting node_modules..."
rm -rf node_modules

echo "2. Deleting package-lock.json or yarn.lock (deleting package-lock.json for npm users)..."
rm -f package-lock.json

echo "3. Deleting .expo and ~/.expo cache directories..."
rm -rf .expo
rm -rf ~/.expo

echo "4. Deleting /tmp/metro-* cache files..."
rm -rf /tmp/metro-*

echo "5. Forcibly cleaning npm cache..."
npm cache clean --force

echo "6. Clearing Watchman cache..."
watchman watch-del-all

echo "7. Deleting Babel Loader cache..."
rm -rf ./node_modules/.cache/babel-loader

echo "8. Reinstalling all dependencies (npm install)..."
npm install

echo "--- Cleanup and reinstallation complete ---"

echo "You can now start the Metro Bundler with 'npx react-native start --reset-cache' or 'npm start -- --reset-cache'."
