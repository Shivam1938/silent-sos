import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export const SosButton = ({ onPress, disabled, isActive, isLoading }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isActive ? styles.containerActive : styles.containerIdle,
        pressed && !disabled ? styles.containerPressed : null,
        disabled ? styles.containerDisabled : null,
      ]}
      disabled={disabled}
    >
      <View style={styles.innerCircle}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Text style={styles.label}>{isActive ? 'SOS Active' : 'Press 3x\nfor SOS'}</Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 220,
    borderRadius: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    shadowColor: '#ef4444',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  containerIdle: {
    backgroundColor: '#dc2626',
  },
  containerActive: {
    backgroundColor: '#022c22',
  },
  containerPressed: {
    transform: [{ scale: 0.96 }],
  },
  containerDisabled: {
    opacity: 0.6,
  },
  innerCircle: {
    width: 180,
    height: 180,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  label: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

