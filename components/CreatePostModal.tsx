import { useAuth } from '@/context/AuthContext';
import { PostType } from '@/models/Post';
import { postService } from '@/services/postService';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onPostCreated,
}) => {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Sorry, we need camera roll permissions to make this work!',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedType || !title || !content || !user) {
      Toast.show({
        type: 'info',
        text1: 'Missing Information',
        text2: 'Please select a type, title, and provide content.',
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
        content,
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
        setSelectedType(null);
        setTitle('');
        setContent('');
        setImages([]);
        
        onPostCreated();
        onClose();
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
    }
  };

  const renderTypeSelection = () => (
    <View style={styles.typeContainer}>
      <Text style={styles.title}>What would you like to share?</Text>
      <TouchableOpacity
        style={[styles.typeButton, selectedType === 'Offer Help' && styles.selectedType]}
        onPress={() => setSelectedType('Offer Help')}
      >
        <Text style={styles.typeText}>Offer Help</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.typeButton, selectedType === 'Ask for Help' && styles.selectedType]}
        onPress={() => setSelectedType('Ask for Help')}
      >
        <Text style={styles.typeText}>Ask for Help</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.typeButton, selectedType === 'Story' && styles.selectedType]}
        onPress={() => setSelectedType('Story')}
      >
        <Text style={styles.typeText}>Create a Story</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPostForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick} disabled={isLoading}>
        <Text style={[styles.imageButtonText, isLoading && { opacity: 0.5 }]}>
          {images.length > 0 ? 'Change Image' : 'Add Image (Optional)'}
        </Text>
      </TouchableOpacity>
      {images.length > 0 && (
        <View style={styles.imagePreviewContainer}>
           {images.map((imageUri, index) => (
            <View key={index} style={styles.imagePreviewWrapper}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
               <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
               >
                  <Text style={styles.removeImageButtonText}>X</Text>
               </TouchableOpacity>
            </View>
           ))}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, isLoading && { opacity: 0.5 }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isLoading || !title || !content || !selectedType}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Create Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {!selectedType ? renderTypeSelection() : renderPostForm()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  typeContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  typeButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: '#007AFF',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
}); 