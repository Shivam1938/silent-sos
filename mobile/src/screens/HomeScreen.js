import React, { useCallback } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { SosButton } from '../components/SosButton';
import { useAuth } from '../context/AuthContext';
import { useSos } from '../context/SosContext';
import { usePatternActivator } from '../hooks/usePatternActivator';

export const HomeScreen = ({ navigation }) => {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { startSos, cancelActiveSos, isSending, isActive, activeEvent, lastError } = useSos();

  const handleTrigger = useCallback(async () => {
    try {
      await startSos();
      Alert.alert('SOS sent', 'Your trusted contacts are being notified with your live location.');
    } catch (error) {
      Alert.alert('SOS failed', error?.message ?? 'Unable to trigger SOS. Try again.');
    }
  }, [startSos]);

  const handlePatternPress = usePatternActivator({
    requiredPresses: 3,
    timeWindow: 1800,
    onActivate: handleTrigger,
  });

  const handleCancel = useCallback(() => {
    Alert.alert('Cancel SOS', 'Are you sure you want to cancel the SOS alert?', [
      {
        text: 'Keep active',
        style: 'cancel',
      },
      {
        text: 'Cancel SOS',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelActiveSos('user_cancelled');
          } catch (error) {
            Alert.alert('Unable to cancel', error?.message ?? 'Please try again.');
          }
        },
      },
    ]);
  }, [cancelActiveSos]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi {user?.displayName ?? 'there'} 👋</Text>
          <Text style={styles.subtitle}>
            {isActive ? 'SOS is live. Location is being shared.' : 'Press the button to trigger SOS.'}
          </Text>
        </View>
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => navigation.navigate('Contacts')}
            style={({ pressed }) => [styles.contactsBadge, pressed ? styles.contactsBadgePressed : null]}
          >
            <Text style={styles.contactsText}>Contacts</Text>
          </Pressable>
          <Pressable
            onPress={signOut}
            disabled={authLoading}
            style={({ pressed }) => [
              styles.logoutBadge,
              pressed ? styles.logoutBadgePressed : null,
              authLoading ? styles.logoutBadgeDisabled : null,
            ]}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.helperText}>Triple-tap the button or use the hardware volume-up key</Text>
        <SosButton onPress={handlePatternPress} disabled={isSending} isActive={isActive} isLoading={isSending} />
        {isActive ? (
          <View style={styles.statusCard}>
            <Text style={styles.statusHeading}>Live tracking</Text>
            <Text style={styles.statusText}>
              Last update:{' '}
              {activeEvent?.lastUpdate
                ? `${Math.round((Date.now() - activeEvent.lastUpdate) / 1000)}s ago`
                : 'Just now'}
            </Text>
            {activeEvent?.lastLocation && (
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    `https://maps.google.com/?q=${activeEvent.lastLocation.latitude},${activeEvent.lastLocation.longitude}`
                  )
                }
              >
                <Text style={styles.link}>
                  View on map ({activeEvent.lastLocation.latitude.toFixed(4)},{' '}
                  {activeEvent.lastLocation.longitude.toFixed(4)})
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed ? styles.cancelButtonPressed : null,
                isSending ? styles.cancelButtonDisabled : null,
              ]}
              disabled={isSending}
            >
              <Text style={styles.cancelButtonLabel}>Cancel SOS</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.infoHeading}>Stay prepared</Text>
            <Text style={styles.infoText}>
              Silent SOS will message your trusted contacts with a live location link when triggered. Add at least two
              contacts for best results.
            </Text>
          </View>
        )}
        {lastError ? <Text style={styles.errorText}>Last issue: {lastError.message}</Text> : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: '#cbd5f5',
    marginTop: 8,
  },
  contactsBadge: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  contactsBadgePressed: {
    opacity: 0.8,
  },
  contactsText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f87171',
  },
  logoutBadgePressed: {
    opacity: 0.75,
  },
  logoutBadgeDisabled: {
    opacity: 0.5,
  },
  logoutText: {
    color: '#fca5a5',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 48,
  },
  helperText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
  statusCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    width: '100%',
    gap: 12,
  },
  infoCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    width: '100%',
    gap: 12,
  },
  infoHeading: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 18,
  },
  infoText: {
    color: '#cbd5f5',
    fontSize: 15,
    lineHeight: 20,
  },
  statusHeading: {
    color: '#22d3ee',
    fontWeight: '700',
    fontSize: 18,
  },
  statusText: {
    color: '#f8fafc',
  },
  link: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonPressed: {
    opacity: 0.8,
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  errorText: {
    marginTop: 12,
    color: '#f97316',
  },
});

