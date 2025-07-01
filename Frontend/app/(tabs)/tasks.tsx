import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Sample data for tasks
const sampleTasks = [
  { id: '1', title: 'Respond to gardening help request', completed: false },
  { id: '2', title: 'Confirm community cleanup attendance', completed: true },
  { id: '3', title: 'Prepare materials for English tutoring session', completed: false },
];

const TasksPage = () => {
  // In a real app, you would fetch and manage tasks from an API
  const [tasks, setTasks] = React.useState(sampleTasks);

  const toggleTaskCompleted = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const renderTaskItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.taskItem} onPress={() => toggleTaskCompleted(item.id)}>
      <Ionicons 
        name={item.completed ? 'checkbox-outline' : 'square-outline'}
        size={24}
        color={item.completed ? '#4CAF50' : '#666'}
        style={styles.taskCheckbox}
      />
      <Text style={[styles.taskTitle, item.completed && styles.completedTaskTitle]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
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
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  taskCheckbox: {
    marginRight: 15,
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1, // Allow text to take available space
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
});

export default TasksPage; 