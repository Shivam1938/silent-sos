import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const [pin, setPin] = useState('');

  const handleLogin = async () => {
    if (pin.length < 4) {
      Alert.alert('Enter PIN', 'Please enter your 4-digit safety PIN.');
      return;
    }

    try {
      await login({ pin });
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Incorrect PIN. Please try again.';
      Alert.alert('Login failed', message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>Enter your safety PIN to access Silent SOS.</Text>

        <TextInput
          value={pin}
          onChangeText={setPin}
          placeholder="****"
          placeholderTextColor="#94a3b8"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          style={styles.input}
        />

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.primaryButton,
            isLoading ? styles.buttonDisabled : null,
            pressed && !isLoading ? styles.buttonPressed : null,
          ]}
          disabled={isLoading}
        >
          <Text style={styles.primaryLabel}>{isLoading ? 'Signing in…' : 'Unlock'}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Registration')} style={styles.secondaryButton}>
          <Text style={styles.secondaryLabel}>First time? Create profile</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 96,
    gap: 16,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subheading: {
    color: '#cbd5f5',
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 20,
    letterSpacing: 10,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#22d3ee',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  secondaryButton: {
    marginTop: 32,
  },
  secondaryLabel: {
    textAlign: 'center',
    color: '#94a3b8',
    fontWeight: '600',
  },
});

