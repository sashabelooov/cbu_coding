import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login, skipAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <Ionicons name="wallet" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.title}>FinanceApp</Text>
          <Text style={styles.subtitle}>Manage your money wisely</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={skipAuth}>
          <Text style={styles.skipText}>Skip for now</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoWrapper: {
    width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.primary + '15',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  form: { gap: 16 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  button: {
    backgroundColor: Colors.primary, borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
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
