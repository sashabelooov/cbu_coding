import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { createAccount } from '../api/accounts';

const ACCOUNT_TYPES = ['CARD', 'BANK', 'CASH', 'E_WALLET'];
const CURRENCIES = ['UZS', 'USD', 'EUR', 'RUB'];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function AddAccountScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [type, setType] = useState('CARD');
  const [currency, setCurrency] = useState('UZS');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Please enter account name'); return; }
    setLoading(true);
    try {
      await createAccount({ name: name.trim(), type, currency, balance: parseFloat(balance) || 0, color });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Account Name</Text>
      <TextInput style={styles.input} placeholder="e.g. Main Card" placeholderTextColor={Colors.textLight} value={name} onChangeText={setName} />

      <Text style={styles.label}>Account Type</Text>
      <View style={styles.chipRow}>
        {ACCOUNT_TYPES.map((t) => (
          <TouchableOpacity key={t} style={[styles.chip, type === t && styles.chipActive]} onPress={() => setType(t)}>
            <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Currency</Text>
      <View style={styles.chipRow}>
        {CURRENCIES.map((c) => (
          <TouchableOpacity key={c} style={[styles.chip, currency === c && styles.chipActive]} onPress={() => setCurrency(c)}>
            <Text style={[styles.chipText, currency === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Initial Balance</Text>
      <TextInput style={styles.input} placeholder="0.00" placeholderTextColor={Colors.textLight} value={balance} onChangeText={setBalance} keyboardType="numeric" />

      <Text style={styles.label}>Color</Text>
      <View style={styles.colorRow}>
        {COLORS.map((c) => (
          <TouchableOpacity key={c} style={[styles.colorCircle, { backgroundColor: c }, color === c && styles.colorActive]} onPress={() => setColor(c)} />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 48, fontSize: 15, color: Colors.text },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorCircle: { width: 32, height: 32, borderRadius: 16 },
  colorActive: { borderWidth: 3, borderColor: Colors.text },
  button: { backgroundColor: Colors.primary, borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
