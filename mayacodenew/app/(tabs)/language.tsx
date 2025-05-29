import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
// You might add localization libraries here later, e.g., import { useTranslation } from 'react-i18next';

// Sample language data (replace with your actual supported languages)
const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: '91', name: 'Hindi' },
  { code: '358', name: 'Suomi' },
  { code: '46', name: 'Svenska' },
  { code: '380', name: 'Українська мова' },
  { code: '47', name: 'Norsk' },
  { code: '49', name: 'Deutsch' },
  { code: '34', name: 'Español' },
  { code: '351', name: 'Português' },
];

const LanguagePage = () => {
  // Example state for selected language (replace with actual logic)
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');

  // Example function to change language (replace with actual logic)
  const changeLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
    // Implement actual language change logic here (e.g., using a localization library)
    console.log(`Changing language to ${langCode}`);
    // You might want to persist the selected language (e.g., using AsyncStorage)
  };

  const renderLanguageItem = ({ item }: { item: { code: string; name: string } }) => (
    <TouchableOpacity 
      style={[
        styles.languageButton,
        selectedLanguage === item.code && styles.selectedLanguageButton
      ]}
      onPress={() => changeLanguage(item.code)}
    >
      <Text style={[
        styles.languageButtonText,
        selectedLanguage === item.code && styles.selectedLanguageButtonText
      ]}>
        {item.name}
      </Text>
      {selectedLanguage === item.code && (
        <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.selectedIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>
      <FlatList
        data={supportedLanguages}
        renderItem={renderLanguageItem}
        keyExtractor={item => item.code}
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
    marginBottom: 30,
    textAlign: 'left',
    color: '#2C3E50',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  selectedLanguageButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  languageButtonText: {
    fontSize: 18,
    color: '#000',
  },
  selectedLanguageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedIcon: {
    marginLeft: 10,
  },
});

export default LanguagePage; 