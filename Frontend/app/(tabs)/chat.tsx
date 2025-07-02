import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SocketProvider } from "../../context/SocketContext";

// Sample data for chat contacts
const sampleContacts = [
  { id: 'contact1', name: 'Volunteer for Food Delivery' },
  { id: 'contact2', name: 'Person Asking for Math Help' },
  { id: 'contact3', name: 'Offering Help with Gardening' },
  { id: 'contact4', name: 'Admin - Regarding Your Post' },
];

const Chat = () => {
  const router = useRouter();

  const handleContactPress = (contactId: string, contactName: string) => {
    // Navigate to a new screen for individual chat
    // We will create individual-chat.tsx next
    router.push({ pathname: '/individual-chat', params: { chatId: contactId, name: contactName } });
  };

  return (
    <SocketProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.header}>Chats</Text>
          <ScrollView style={styles.contactsList}>
            {sampleContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => handleContactPress(contact.id, contact.name)}
              >
                <Text style={styles.contactName}>{contact.name}</Text>
                {/* Add a placeholder for last message or time if needed */}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </SocketProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFDE3', // Match app background
  },
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
    color: '#2C3E50',
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Chat;