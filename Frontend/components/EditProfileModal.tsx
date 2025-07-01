import { useAuth, User } from '@/context/AuthContext';
import { UserProfile, UserType } from '@/models/User';
import { userService } from '@/services/userService';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';
import Toast from 'react-native-toast-message';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
  userProfile: UserProfile | null;
  onSave: () => void;
}

const userTypes: UserType[] = ['Refugee', 'Helper', 'Other'];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  user,
  userProfile,
  onSave,
}) => {
  const { checkAuthStatus } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(userProfile?.age ? String(userProfile.age) : '');
  const [location, setLocation] = useState(userProfile?.location || '');
  const [userType, setUserType] = useState<UserType>(userProfile?.userType || 'Refugee');
  const [languages, setLanguages] = useState<string[]>(userProfile?.languages || []);
  const [newLanguageInput, setNewLanguageInput] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [existingProfileImageUrl, setExistingProfileImageUrl] = useState<string | null>(userProfile?.profileImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);

  useEffect(() => {
    if (visible && user) {
      setName(userProfile?.name || user.name || '');
      setAge(userProfile?.age ? String(userProfile.age) : '');
      setLocation(userProfile?.location || '');
      setUserType(userProfile?.userType || 'Refugee');
      setLanguages(userProfile?.languages || []);
      setExistingProfileImageUrl(userProfile?.profileImage || null);
      setProfileImage(null);
      setNewLanguageInput('');
    }
  }, [visible, user, userProfile]);

  const handleImagePick = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setExistingProfileImageUrl(null);
    }
  };

  const handleAddLanguage = () => {
    if (newLanguageInput.trim() && !languages.includes(newLanguageInput.trim())) {
      setLanguages([...languages, newLanguageInput.trim()]);
      setNewLanguageInput('');
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    setLanguages(languages.filter(lang => lang !== languageToRemove));
  };

  const handleSubmit = async () => {
    if (isLoading) return; // Prevent multiple submissions
    
    try {
      setIsLoading(true);
      const profileData: Partial<UserProfile> = {
        name: name,
        age: age ? parseInt(age, 10) : undefined,
        location: location || undefined,
        userType: userType,
        languages: languages.length > 0 ? languages : [],
        profileImage: profileImage || existingProfileImageUrl || undefined
      };

      const result = await userService.updateUserProfile(profileData);
      if (result) {
        console.log('User profile updated successfully:', result);
        Toast.show({
          type: 'success',
          text1: 'Profile Saved!',
          text2: 'Your profile has been updated.',
        });
        onSave();
        onClose();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* Scrollable Content */}
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Profile Image Section */}
              <View style={styles.imageSection}>
                <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
                  {existingProfileImageUrl || profileImage ? (
                    <Image 
                      source={{ uri: profileImage || existingProfileImageUrl! }} 
                      style={styles.profileImage} 
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons name="person" size={50} color="#999" />
                    </View>
                  )}
                  <View style={styles.imageEditOverlay}>
                    <Ionicons name="camera" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.imagePickerText}>Tap to change photo</Text>
              </View>

              {/* Form Fields */}
              <View style={styles.formContainer}>
                {/* Name Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Age Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={setAge}
                    placeholder="Enter your age"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                  />
                </View>

                {/* Location Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Location</Text>
                  <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Enter your location"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* User Type Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>User Type</Text>
                  <TouchableOpacity 
                    style={styles.pickerContainer}
                    onPress={() => setShowUserTypeModal(true)}
                    disabled={isLoading}
                  >
                    <Text style={[styles.pickerText, isLoading && { opacity: 0.5 }]}>
                      {userType || 'Select User Type'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* User Type Modal */}
                <Modal
                  visible={showUserTypeModal}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowUserTypeModal(false)}
                >
                  <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowUserTypeModal(false)}
                  >
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select User Type</Text>
                        <TouchableOpacity onPress={() => setShowUserTypeModal(false)}>
                          <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                      </View>
                      <ScrollView>
                        {userTypes.map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.optionItem,
                              userType === type && styles.selectedOption
                            ]}
                            onPress={() => {
                              setUserType(type as UserType);
                              setShowUserTypeModal(false);
                            }}
                          >
                            <Text style={[
                              styles.optionText,
                              userType === type && styles.selectedOptionText
                            ]}>
                              {type}
                            </Text>
                            {userType === type && (
                              <Ionicons name="checkmark" size={20} color="#007AFF" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/* Spoken Languages Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Spoken Languages</Text>
                  <View style={styles.addedLanguagesContainer}>
                    {languages.map((lang, index) => (
                      <View key={index} style={styles.languageTag}>
                        <Text style={styles.languageTagText}>{lang}</Text>
                        <TouchableOpacity onPress={() => handleRemoveLanguage(lang)} style={styles.removeLanguageButton}>
                          <Ionicons name="close-circle" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  <View style={styles.newLanguageInputContainer}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0 }]}
                      value={newLanguageInput}
                      onChangeText={setNewLanguageInput}
                      placeholder="Add a language"
                      placeholderTextColor="#999"
                      onSubmitEditing={handleAddLanguage}
                      blurOnSubmit={false}
                    />
                    <TouchableOpacity 
                      onPress={handleAddLanguage} 
                      style={styles.addLanguageButton}
                      disabled={!newLanguageInput.trim()}
                    >
                      <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Fixed Bottom Buttons */}
            <View style={styles.bottomContainer}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, isLoading && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <Text style={styles.saveButtonText}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#a8e6a1',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  imagePicker: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  imageEditOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  imagePickerText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  selectedOption: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  addedLanguagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  languageTag: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  languageTagText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 4,
  },
  removeLanguageButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  newLanguageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addLanguageButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#a8e6a1',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});