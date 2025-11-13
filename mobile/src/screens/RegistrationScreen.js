import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';

export const RegistrationScreen = ({ navigation }) => {
  const { register, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      Alert.alert('Add your name', 'Please share your name so contacts can identify you.');
      return;
    }
    if (pin.length < 4) {
      Alert.alert('Set a 4-digit PIN', 'Use the PIN to cancel SOS if triggered accidentally.');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert('Pins do not match', 'Confirm PIN must match the PIN.');
      return;
    }

    try {
      await register({ displayName: displayName.trim(), pin });
    } catch (error) {
      console.error(error);
      Alert.alert('Registration failed', error?.response?.data?.message ?? error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Silent SOS</Text>
          <Text style={styles.subheading}>Set up your emergency profile</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            placeholderTextColor="#94a3b8"
            style={styles.input}
          />
          <Text style={styles.label}>4-digit safety PIN</Text>
          <TextInput
            value={pin}
            onChangeText={setPin}
            placeholder="****"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={4}
            style={styles.input}
          />
          <Text style={styles.label}>Confirm PIN</Text>
          <TextInput
            value={confirmPin}
            onChangeText={setConfirmPin}
            placeholder="****"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={4}
            style={styles.input}
          />
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.button,
              isLoading && styles.buttonDisabled,
              pressed && !isLoading ? styles.buttonPressed : null,
            ]}
            disabled={isLoading}
          >
            <Text style={styles.buttonLabel}>{isLoading ? 'Saving…' : 'Save & Continue'}</Text>
          </Pressable>
        </View>
        <Text style={styles.footerNote}>
          Tip: Later you can trigger Silent SOS by pressing the hardware volume-up key 3 times, or
          use the SOS button inside the app.
        </Text>
        <Pressable onPress={() => navigation.navigate('Login')} style={styles.switchAuthButton}>
          <Text style={styles.switchAuthLabel}>Already registered? Sign in</Text>
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
    paddingTop: 48,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 32,
    color: '#f8fafc',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subheading: {
    marginTop: 8,
    color: '#cbd5f5',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  label: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderColor: '#1e293b',
    borderWidth: 1,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#22d3ee',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  buttonLabel: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  footerNote: {
    marginTop: 24,
    color: '#93c5fd',
    fontSize: 14,
    textAlign: 'center',
  },
  switchAuthButton: {
    marginTop: 16,
  },
  switchAuthLabel: {
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '600',
  },
});

