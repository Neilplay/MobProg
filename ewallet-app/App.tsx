import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AccountManager from './components/AccountManager';
import TransactionScreen from './components/TransactionScreen';
import QRCodeScanner from './components/QRCodeScanner';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

type RootStackParamList = {
  AccountManager: undefined;
  TransactionScreen: undefined;
  QRCodeScanner: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator initialRouteName="AccountManager" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AccountManager" component={AccountManager} />
          <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
          <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
