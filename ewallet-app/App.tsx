import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountManager from './components/AccountManager';
import TransactionScreen from './components/TransactionScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TransactionHistory from './components/TransactionHistory';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Tab.Navigator
          initialRouteName="AccountManager"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              if (route.name === 'AccountManager') {
                iconName = focused ? 'wallet' : 'wallet-outline';
              } else if (route.name === 'TransactionScreen') {
                iconName = focused ? 'cash' : 'cash-outline';
              } else if (route.name === 'TransactionHistory') {
                iconName = focused ? 'list' : 'list-outline';
              } else {
                iconName = 'help-circle';
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


      </NavigationContainer>
    </SafeAreaProvider>
  );
}
