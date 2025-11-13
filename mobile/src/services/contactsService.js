import { apiClient } from './apiClient';

export const fetchContacts = async () => {
  const response = await apiClient.get('/api/contacts');
  return response.data.contacts ?? [];
};

export const createContact = async (payload) => {
  const response = await apiClient.post('/api/contacts', payload);
  return response.data.contact;
};

export const deleteContact = async (id) => {
  await apiClient.delete(`/api/contacts/${id}`);
};

