import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { createDebt } from '../api/debts';

export default function AddDebtScreen({ navigation, route }: any) {
  const defaultType = route?.params?.defaultType || 'DEBT';
  const [type, setType] = useState<'DEBT' | 'RECEIVABLE'>(defaultType);
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('UZS');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!personName.trim()) { Alert.alert('Error', 'Please enter person name'); return; }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Please enter a valid amount'); return; }
    setLoading(true);
    try {
      await createDebt({ type, person_name: personName.trim(), amount: parseFloat(amount), currency, description: description.trim() || undefined });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to create');
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.toggleRow}>
        <TouchableOpacity style={[styles.toggle, type === 'DEBT' && { backgroundColor: Colors.expense }]} onPress={() => setType('DEBT')}>
          <Text style={[styles.toggleText, type === 'DEBT' && { color: '#fff' }]}>I Owe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggle, type === 'RECEIVABLE' && { backgroundColor: Colors.income }]} onPress={() => setType('RECEIVABLE')}>
          <Text style={[styles.toggleText, type === 'RECEIVABLE' && { color: '#fff' }]}>Owed to Me</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Person Name</Text>
      <TextInput style={styles.input} placeholder="Who?" placeholderTextColor={Colors.textLight} value={personName} onChangeText={setPersonName} />

      <Text style={styles.label}>Amount</Text>
      <TextInput style={styles.amountInput} placeholder="0.00" placeholderTextColor={Colors.textLight} value={amount} onChangeText={setAmount} keyboardType="numeric" />

      <Text style={styles.label}>Currency</Text>
      <View style={styles.chipRow}>
        {['UZS', 'USD', 'EUR', 'RUB'].map((c) => (
          <TouchableOpacity key={c} style={[styles.chip, currency === c && styles.chipActive]} onPress={() => setCurrency(c)}>
            <Text style={[styles.chipText, currency === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput style={styles.input} placeholder="What for?" placeholderTextColor={Colors.textLight} value={description} onChangeText={setDescription} />

      <TouchableOpacity style={[styles.button, { backgroundColor: type === 'DEBT' ? Colors.expense : Colors.income }]} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  toggle: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  toggleText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 48, fontSize: 15, color: Colors.text },
  amountInput: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 56, fontSize: 24, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  button: { borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
