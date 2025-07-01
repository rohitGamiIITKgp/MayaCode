import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HelpPostCardProps {
  title: string;
  description: string;
  imageSource: ImageSourcePropType;
  onPress: () => void;
}

export const HelpPostCard: React.FC<HelpPostCardProps> = ({
  title,
  description,
  imageSource,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <ImageBackground source={imageSource} style={styles.imageBackground}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
      <View style={styles.content}>
        <Text style={styles.description}>{description}</Text>
        <Ionicons name="arrow-forward" size={24} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageBackground: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    marginRight: 10,
  },
}); 