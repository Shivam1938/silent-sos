import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RegistrationScreen } from '../screens/RegistrationScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ContactsScreen } from '../screens/ContactsScreen';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#020617',
  },
};

const LoadingView = () => (
  <View style={styles.loader}>
    <ActivityIndicator size="large" color="#22d3ee" />
    <Text style={styles.loaderText}>Preparing Silent SOS…</Text>
  </View>
);

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <NavigationContainer theme={navigationTheme}>
      {isLoading ? (
        <LoadingView />
      ) : (
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'Home' : 'Login'}
          screenOptions={{
            headerStyle: { backgroundColor: '#020617' },
            headerTintColor: '#f8fafc',
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          {isAuthenticated ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Contacts"
                component={ContactsScreen}
                options={{
                  title: 'Trusted contacts',
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{
                  headerShown: false,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loaderText: {
    color: '#94a3b8',
  },
});

