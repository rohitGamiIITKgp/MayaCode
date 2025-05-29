import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Sample chat data for different chat IDs
const allSampleMessages: { [key: string]: { id: number; text: string; sender: string }[] } = {
  contact1: [
    { id: 1, text: 'Hi there, I\'m available for food delivery assistance.', sender: 'other' },
    { id: 2, text: 'That\'s great! Where are you located?', sender: 'me' },
    { id: 3, text: 'I\'m in the downtown area, happy to help within a 5-mile radius.', sender: 'other' },
    { id: 4, text: 'Okay, perfect. I need a few items from the grocery store.', sender: 'me' },
    { id: 5, text: 'Sure, send me the list whenever you\'re ready.', sender: 'other' },
    { id: 6, text: 'Will do. Is there a preferred payment method?', sender: 'me' },
    { id: 7, text: 'Cash is fine, or I can accept payment apps too.', sender: 'other' },
    { id: 8, text: 'Great. I\'ll send you the list and my address shortly.', sender: 'me' },
    { id: 9, text: 'Sounds good. I\'ll head out as soon as I get it.', sender: 'other' },
    { id: 10, text: 'Thanks again for doing this!', sender: 'me' },
    { id: 11, text: 'Happy to help!', sender: 'other' },
    { id: 12, text: 'Just sent the list.', sender: 'me' },
    { id: 13, text: 'Got it, on my way now.', sender: 'other' },
    { id: 14, text: 'Okay, let me know when you\'re close.', sender: 'me' },
    { id: 15, text: 'Will do. Traffic seems okay.', sender: 'other' },
    { id: 16, text: 'Alright, stay safe!', sender: 'me' },
    { id: 17, text: 'Thanks, almost there.', sender: 'other' },
    { id: 18, text: 'Just arrived.', sender: 'other' },
    { id: 19, text: 'Coming down now!', sender: 'me' },
    { id: 20, text: 'Got the groceries, everything looks good. Thanks a million!', sender: 'me' },
    { id: 21, text: 'Glad I could help! Let me know if you need anything else.', sender: 'other' },
    { id: 22, text: 'Will do. Have a great day!', sender: 'me' },
    { id: 23, text: 'You too!', sender: 'other' },
    // Add more messages for contact1
  ],
  contact2: [
    { id: 1, text: 'Hello, I saw your math help request. What level are you studying?', sender: 'other' },
    { id: 2, text: 'Hi! It\'s for high school algebra.', sender: 'me' },
    { id: 3, text: 'Okay, I can help with that. Do you have specific topics?', sender: 'other' },
    // Add more messages for contact2
  ],
  contact3: [
    { id: 1, text: 'Hey, I\'m offering help with gardening for elderly neighbors.', sender: 'other' },
    { id: 2, text: 'That\'s a wonderful initiative! My grandmother could use some help.', sender: 'me' },
    { id: 3, text: 'Great! What kind of help does she need?', sender: 'other' },
    // Add more messages for contact3
  ],
  contact4: [
    { id: 1, text: 'Hello, this is Maya from admin regarding your recent post.', sender: 'other' },
    { id: 2, text: 'Hi Maya, is there an issue with my post?', sender: 'me' },
    { id: 3, text: 'No issue, just a quick question about the location you specified.', sender: 'other' },
    // Add more messages for contact4
  ],
  // Add more chat IDs and their sample messages here
};

// Basic ChatMessage component (moved from chat.tsx)
interface ChatMessageProps {
  message: { id: number; text: string; sender: string };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <View style={[styles.messageContainer, message.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
  );
};

const IndividualChatScreen = () => {
  const { chatId, name } = useLocalSearchParams();
  const router = useRouter();
  const [messageInput, setMessageInput] = useState('');

  // Get messages for the current chat ID, or an empty array if not found
  const currentChatMessages = chatId && typeof chatId === 'string' ? allSampleMessages[chatId] || [] : [];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, send the message via API and add to state
      console.log(`Sending message to ${name} (chat ID: ${chatId}): ${messageInput}`);
      setMessageInput('');
      // Note: For this static example, messages won't appear in the UI after sending.
      // A real implementation would update a state variable holding the messages.
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/chat')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {typeof name === 'string' ? name : 'Chat'}
        </Text>
      </View>
      <ScrollView style={styles.messagesList} contentContainerStyle={styles.messagesContent}>
        {currentChatMessages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={messageInput}
          onChangeText={setMessageInput}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FDFDE3',
    paddingBottom: 70,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  messagesList: {
    flex: 1,
    padding: 0,
  },
  messagesContent: {
    paddingBottom: 100,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#075E54',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IndividualChatScreen; 