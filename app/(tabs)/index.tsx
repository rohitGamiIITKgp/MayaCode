import Header from '@/components/Header';
import { HelpPostCard } from '@/components/HelpPostCard';
import { StoryCard } from '@/components/StoryCard';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const featuredCourses = [
  {
    id: 1,
    title: 'Python Basics',
    description: 'Learn Python programming from scratch',
    image: require('@/assets/python.svg'),
    progress: 0,
  },
  {
    id: 2,
    title: 'Web Development',
    description: 'Master HTML, CSS, and JavaScript',
    image: require('@/assets/web.svg'),
    progress: 0,
  },
  {
    id: 3,
    title: 'Data Structures',
    description: 'Essential data structures and algorithms',
    image: require('@/assets/ds.svg'),
    progress: 0,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDE3' }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Hello! What should we do today?</Text>

        <HelpPostCard
          title="Help posts"
          description="Ask and give help between community members and build lasting connections"
          imageSource={require('@/assets/images/help-posts.png')}
          onPress={() => router.push('/help-and-ask')}
        />

        <StoryCard
          title="Stories"
          description="Share your helping moments and inspire others to do more! Get inspired by others."
          imageSource={require('@/assets/images/stories.png')}
          onPress={() => router.push('/stories')}
        />

        {/* You can add more sections here for featured courses or other content */}

        <TouchableOpacity style={styles.helpPostsButton} onPress={() => router.push('/helpAndAsk')}>
          <Text style={styles.helpPostsButtonText}>Go to help posts</Text>
          <Ionicons name="add-outline" size={24} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  helpPostsButton: {
    backgroundColor: '#3A6F4C', // Green color from image
    padding: 12, // Reduced padding
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally
    flexDirection: 'row', // Arrange children in a row
    marginTop: 15, // Adjusted margin top
    marginHorizontal: 20, // Adjusted horizontal margin
    alignSelf: 'center', // Center the button and size it to content
  },
  helpPostsButtonText: {
    color: '#fff',
    fontSize: 16, // Reduced font size
    fontWeight: 'bold',
  },
});