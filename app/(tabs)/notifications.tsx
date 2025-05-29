import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// Sample data for notifications
const sampleNotifications = [
  { id: '1', message: 'You have a new message from John Doe.', timestamp: '2023-10-27T10:00:00Z' },
  { id: '2', message: 'Your help offer for gardening has been accepted.', timestamp: '2023-10-27T09:30:00Z' },
  { id: '3', message: 'New help request posted near your location.', timestamp: '2023-10-27T08:00:00Z' },
  { id: '4', message: 'Reminder: Community cleanup tomorrow.', timestamp: '2023-10-26T18:00:00Z' },
];

const NotificationsPage = () => {
  // In a real app, you would fetch notifications from an API
  const notifications = sampleNotifications;

  const renderNotificationItem = ({ item }: { item: any }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDE3', // Example background color
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
    textAlign: 'left',
    color: '#2C3E50',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationMessage: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default NotificationsPage;