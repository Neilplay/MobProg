import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import AccountManager from "./components/AccountManager";
import TransactionScreen from "./components/TransactionScreen";
import TransactionHistory from "./components/TransactionHistory";
import LoginPage from "./components/LoginPage";
import ForgotPassword from "./components/ForgotPassword";
import SignUp from "./components/SignUp";
import ProfilePage from "./components/ProfilePage"; // Import the new component

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define types for props
interface AuthStackProps {
  handleLogin: () => void;
}

const AuthStack: React.FC<AuthStackProps> = ({ handleLogin }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login">
      {() => <LoginPage onLogin={handleLogin} />}
    </Stack.Screen>
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="SignUp" component={SignUp} />
  </Stack.Navigator>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (): void => {
    setIsLoggedIn(true);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        {!isLoggedIn ? (
          <AuthStack handleLogin={handleLogin} />
        ) : (
          <Tab.Navigator
            initialRouteName="AccountManager"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName = "";
                if (route.name === "AccountManager") {
                  iconName = focused ? "wallet" : "wallet-outline";
                } else if (route.name === "TransactionScreen") {
                  iconName = focused ? "cash" : "cash-outline";
                } else if (route.name === "TransactionHistory") {
                  iconName = focused ? "list" : "list-outline";
                } else if (route.name === "ProfilePage") {
                  iconName = focused ? "person" : "person-outline";
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#007BFF",
              tabBarInactiveTintColor: "gray",
              headerShown: false,
            })}
          >
            <Tab.Screen
              name="AccountManager"
              component={AccountManager}
              options={{ title: "Payment Methods" }}
            />
            <Tab.Screen
              name="TransactionScreen"
              component={TransactionScreen}
              options={{ title: "Transactions" }}
            />
            <Tab.Screen
              name="TransactionHistory"
              component={TransactionHistory}
              options={{ title: "History" }}
            />
            <Tab.Screen
              name="ProfilePage"
              component={ProfilePage}
              options={{ title: "Profile" }}
            />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
