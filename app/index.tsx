import { Redirect } from 'expo-router';
import React from 'react';
import { LogBox } from 'react-native';

const RootRedirect = () => {
  // log suppression
  LogBox.ignoreAllLogs(true);
  // Redirect to the default tab screen
  return <Redirect href="/weather" />;
};
export default RootRedirect;