import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  message: string;
}

export default function EmptyState({ icon, message }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={Colors.textLight} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  message: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
});
