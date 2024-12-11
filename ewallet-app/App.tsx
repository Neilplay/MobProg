import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AccountManager from './components/AccountManager';
import TransactionScreen from './components/TransactionScreen';
import TransactionHistory from './components/TransactionHistory';
import LoginPage from './components/LoginPage';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Simulate login logic (replace with actual authentication)
    setIsLoggedIn(true);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <Tab.Navigator
  initialRouteName="AccountManager"
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName: string = ''; // Ensure iconName has a default value

      if (route.name === 'AccountManager') {
        iconName = focused ? 'wallet' : 'wallet-outline';
      } else if (route.name === 'TransactionScreen') {
        iconName = focused ? 'cash' : 'cash-outline';
      } else if (route.name === 'TransactionHistory') {
        iconName = focused ? 'list' : 'list-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#007BFF',
    tabBarInactiveTintColor: 'gray',
    headerShown: false,
  })}
>

            <Tab.Screen
              name="AccountManager"
              component={AccountManager}
              options={{ title: 'Payment Methods' }}
            />
            <Tab.Screen
              name="TransactionScreen"
              component={TransactionScreen}
              options={{ title: 'Transactions' }}
            />
            <Tab.Screen
              name="TransactionHistory"
              component={TransactionHistory}
              options={{ title: 'History' }}
            />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
