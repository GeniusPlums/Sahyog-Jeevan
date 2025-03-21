import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/hooks/useAuth';
import Navigation from './src/navigation';
import 'react-native-gesture-handler';
import * as Updates from 'expo-updates';
import { LogBox, Text, View, StyleSheet } from 'react-native';

// Ignore non-critical warnings
LogBox.ignoreLogs([
  'Failed to download remote update', 
  'Possible Unhandled Promise Rejection',
  'Overwriting Updates.checkForUpdateAsync',
  'Overwriting Updates.fetchUpdateAsync'
]);

// Declare global for TypeScript
declare global {
  namespace globalThis {
    var ExpoUpdates: any;
  }
}

export default function App() {
  useEffect(() => {
    // Disable updates in a safer way
    try {
      // Just disable the update check in the app.json instead of trying to monkey patch
      console.log('Updates disabled via app.json configuration');
    } catch (error) {
      console.log('Error:', error);
    }
  }, []);

  return (
    <AuthProvider>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </AuthProvider>
  );
}
