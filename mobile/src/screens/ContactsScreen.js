import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createContact, deleteContact, fetchContacts } from '../services/contactsService';

const ContactRow = ({ contact, onDelete }) => (
  <View style={styles.contactRow}>
    <View>
      <Text style={styles.contactName}>{contact.name}</Text>
      <Text style={styles.contactMeta}>
        {contact.phoneNumber}
        {contact.relationship ? ` · ${contact.relationship}` : ''}
      </Text>
    </View>
    <Pressable
      onPress={() => onDelete(contact)}
      style={({ pressed }) => [styles.deleteBtn, pressed ? styles.deleteBtnPressed : null]}
    >
      <Text style={styles.deleteLabel}>Remove</Text>
    </Pressable>
  </View>
);

export const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('');

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Unable to load contacts', error?.message ?? 'Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadContacts();
    }, [loadContacts])
  );

  const handleAdd = useCallback(async () => {
    if (!name.trim() || !phoneNumber.trim()) {
      Alert.alert('Add details', 'Name and phone number are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      const newContact = await createContact({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        relationship: relationship.trim() || undefined,
      });
      setContacts((prev) => [newContact, ...prev]);
      setName('');
      setPhoneNumber('');
      setRelationship('');
    } catch (error) {
      console.error(error);
      Alert.alert('Unable to save contact', error?.response?.data?.message ?? error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, phoneNumber, relationship]);

  const handleDelete = useCallback((contact) => {
    Alert.alert('Remove contact', `Remove ${contact.name} from SOS recipients?`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteContact(contact._id);
            setContacts((prev) => prev.filter((item) => item._id !== contact._id));
          } catch (error) {
            Alert.alert('Unable to delete', error?.message ?? 'Please try again.');
          }
        },
      },
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <Text style={styles.heading}>Trusted contacts</Text>
      <Text style={styles.subheading}>We recommend adding at least two people you trust.</Text>
      <View style={styles.form}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+91 99999 99999"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          value={relationship}
          onChangeText={setRelationship}
          placeholder="Relationship (optional)"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />
        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.saveBtn,
            (isSubmitting || isLoading) && styles.saveBtnDisabled,
            pressed && !(isSubmitting || isLoading) ? styles.saveBtnPressed : null,
          ]}
          disabled={isSubmitting || isLoading}
        >
          <Text style={styles.saveLabel}>{isSubmitting ? 'Saving…' : 'Add contact'}</Text>
        </Pressable>
      </View>
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#22d3ee" />
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ContactRow contact={item} onDelete={handleDelete} />}
            contentContainerStyle={contacts.length === 0 ? styles.emptyList : null}
            ListEmptyComponent={<Text style={styles.emptyText}>No contacts yet. Add your first!</Text>}
          />
        )}
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
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
  },
  subheading: {
    marginTop: 8,
    color: '#94a3b8',
  },
  form: {
    marginTop: 24,
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f8fafc',
  },
  saveBtn: {
    backgroundColor: '#38bdf8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnPressed: {
    opacity: 0.85,
  },
  saveLabel: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    marginTop: 24,
  },
  contactRow: {
    padding: 16,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  contactMeta: {
    marginTop: 4,
    color: '#94a3b8',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  deleteBtnPressed: {
    opacity: 0.75,
  },
  deleteLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#475569',
  },
});

