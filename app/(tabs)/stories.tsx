import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Stories = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'my' or 'all'
  const router = useRouter();

  // Placeholder for your story data
  const myStories: any[] = []; // Replace with actual data
  const allStories: any[] = []; // Replace with actual data

  const storiesToShow = activeTab === 'my' ? myStories : allStories;

  const handlePostCreated = () => {
    // Logic to refresh stories after a new one is created
    console.log('Story created, refresh list');
    // You would typically refetch your stories here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stories</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'all' && styles.activeToggle]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.toggleText, activeTab === 'all' && styles.activeToggleText]}>ALL STORIES</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'my' && styles.activeToggle]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.toggleText, activeTab === 'my' && styles.activeToggleText]}>MY STORIES</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.writeButton} onPress={() => router.push('/create-story')}> {/* Navigate to create-story page */}
        <Ionicons name="add-outline" size={24} color="#3A6F4C" />
        <Text style={styles.writeButtonText}>Write a story</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {storiesToShow.length > 0 ? (
          storiesToShow.map((story, index) => (
            // Render your StoryCard component here
            // <StoryCard key={story.id} story={story} /> 
            <Text key={index}>Story Placeholder {index + 1}</Text> // Placeholder text
          ))
        ) : (
          <Text style={styles.noStoriesText}>No stories to display yet.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDFDE3', // Light pink background from image
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: '#2C3E50', // Dark text color
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FCE4EC', // Light pink background for toggle
    borderRadius: 20, // More rounded corners
    overflow: 'hidden',
    padding: 3, // Reduced padding inside the toggle container
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8, // Reduced vertical padding
    alignItems: 'center',
    borderRadius: 15, // Rounded corners for buttons inside toggle
  },
  activeToggle: {
    backgroundColor: '#E91E63', // Pink active toggle color
  },
  toggleText: {
    fontSize: 16,
    color: '#555', // Default text color
    fontWeight: 'bold', // Make text bold
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  writeButton: {
    flexDirection: 'row',
    backgroundColor: '#fff', // White background for write button
    padding: 10,
    borderRadius: 20, // More rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light border
    paddingHorizontal: 20, // Add horizontal padding inside the button
  },
  writeButtonText: {
    color: '#3A6F4C', // Green text color for write button
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  noStoriesText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#555',
  },
});

export default Stories;