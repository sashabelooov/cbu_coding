import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const { register, skipAuth } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password, fullName.trim());
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <Ionicons name="wallet" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start managing your finances</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={Colors.textLight} value={fullName} onChangeText={setFullName} />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.textLight} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.textLight} value={password} onChangeText={setPassword} secureTextEntry />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor={Colors.textLight} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Sign In</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={skipAuth}>
          <Text style={styles.skipText}>Skip for now</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.textLight} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoWrapper: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  form: { gap: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 52 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  button: { backgroundColor: Colors.primary, borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { alignItems: 'center', marginTop: 24 },
  linkText: { fontSize: 14, color: Colors.textSecondary },
  linkBold: { color: Colors.primary, fontWeight: '600' },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
});
