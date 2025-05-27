import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker'; // ✅ Import ImagePicker
import { useAuth } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';
import { postService } from '@/services/postService';
import { PostType } from '@/models/Post';

const CreateStoryScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const selectedType = 'Story';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSelectPhoto = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera roll permissions from settings to select a photo.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleDeletePhoto = () => {
    setImageUri(null);
  };

  const handleSubmit = async () => {
      if (!title || !description || !user) {
        Toast.show({
          type: 'info',
          text1: 'Missing Information',
          text2: 'Please select a type, title, and provide description.',
        });
        return;
      }
  
      setIsLoading(true);
      try {
        const imageUrls = images.length > 0 ? images : undefined;
  
        const newPost = await postService.createPost(
          user.phone,
          selectedType,
          title,
          description,
          {
            images: imageUrls,
          }
        );
  
        if (newPost) {
          Toast.show({
            type: 'success',
            text1: 'Post Created!',
            text2: `Your ${selectedType} has been created successfully.`,
          });
          setTitle('');
          setDescription('');
          setImageUri([]);
          
        } else {
           Toast.show({
            type: 'error',
            text1: 'Creation Failed',
            text2: 'Could not create post. Please try again.',
          });
        }
        
      } catch (error: any) {
        console.error('Error creating post:', error);
        Toast.show({
          type: 'error',
          text1: 'Creation Error',
          text2: error.message || 'An unexpected error occurred.',
        });
      } finally {
        setIsLoading(false);
        router.back();
      }
    };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Same content as before — no changes needed in UI */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Create a new story</Text>

        <View style={styles.warningBox}>
          <Ionicons name="warning-outline" size={24} color="#F57C00" />
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>
              Stories are only for sharing your experiences about helping or volunteering.
            </Text>
            <Text style={styles.warningMessage}>
              Do not ask for help, post unrelated stories or in other ways try to circumvent above point. Your story will not be published if you do so.
            </Text>
          </View>
        </View>

        <View style={styles.imagePlaceholder}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
          ) : (
            <Text style={styles.imagePlaceholderText}>Photo will appear here</Text>
          )}
        </View>

        <TouchableOpacity style={styles.photoButton} onPress={handleSelectPhoto}>
          <Ionicons name="camera-outline" size={24} color="#007AFF" />
          <Text style={styles.photoButtonText}>Select a photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePhoto} disabled={!imageUri}>
          <Ionicons name="trash-outline" size={24} color="#E53935" />
          <Text style={[styles.deleteButtonText, !imageUri && styles.disabledButtonText]}>Delete</Text>
        </TouchableOpacity>

        <Text style={styles.inputLabel}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishButton} onPress={handleSubmit}>
            <Text style={[styles.buttonText, styles.publishButtonText]}>Create and publish</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFDE3', // Light background color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#FDFDE3', // Match background
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    marginLeft: 5,
    color: '#000',
  },
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9C4', // Light yellow background
    borderLeftWidth: 4,
    borderColor: '#FBC02D', // Darker yellow border
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  warningTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  warningMessage: {
    fontSize: 14,
    color: '#777',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#ECEFF1', // Light grey background
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CFD8DC', // Light border
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#78909C', // Grey text color
  },
  selectedImage: {
     width: '100%',
     height: '100%',
     borderRadius: 8,
  },
  photoButton: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD', // Light blue background
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BBDEFB', // Light blue border
  },
  photoButtonText: {
    color: '#0D47A1', // Dark blue text
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE', // Light red background
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFCDD2', // Light red border
  },
  deleteButtonText: {
    color: '#C62828', // Dark red text
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  disabledButtonText: {
    opacity: 0.5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2C3E50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#FDFDE3', // Match background
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  publishButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#4CAF50', // Green color
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Default text color
  },
  publishButtonText: {
    color: '#fff', // White text for publish button
  },
});

export default CreateStoryScreen; 