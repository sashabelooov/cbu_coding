import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Account } from '../types';
import { getAccounts } from '../api/accounts';
import { createTransfer } from '../api/transactions';
import { formatCurrency } from '../utils/format';
import dayjs from 'dayjs';

export default function TransferScreen({ navigation }: any) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { getAccounts().then(setAccounts).catch(console.error); }, []);

  const fromAccount = accounts.find((a) => a.id === fromId);
  const toAccount = accounts.find((a) => a.id === toId);

  const handleTransfer = async () => {
    if (!fromId || !toId) { Alert.alert('Error', 'Please select both accounts'); return; }
    if (fromId === toId) { Alert.alert('Error', 'Cannot transfer to the same account'); return; }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Please enter a valid amount'); return; }
    setLoading(true);
    try {
      await createTransfer({ from_account_id: fromId, to_account_id: toId, amount: parseFloat(amount), description: description.trim() || undefined, date: dayjs().format('YYYY-MM-DD') });
      Alert.alert('Success', 'Transfer completed!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>From Account</Text>
      <View style={styles.chipRow}>
        {accounts.map((a) => (
          <TouchableOpacity key={a.id} style={[styles.chip, fromId === a.id && styles.chipActive]} onPress={() => setFromId(a.id)}>
            <Text style={[styles.chipText, fromId === a.id && styles.chipTextActive]}>{a.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {fromAccount && <Text style={styles.balanceHint}>Balance: {formatCurrency(fromAccount.balance, fromAccount.currency)}</Text>}

      <View style={styles.arrowContainer}>
        <Ionicons name="arrow-down" size={24} color={Colors.primary} />
      </View>

      <Text style={styles.label}>To Account</Text>
      <View style={styles.chipRow}>
        {accounts.filter((a) => a.id !== fromId).map((a) => (
          <TouchableOpacity key={a.id} style={[styles.chip, toId === a.id && styles.chipActive]} onPress={() => setToId(a.id)}>
            <Text style={[styles.chipText, toId === a.id && styles.chipTextActive]}>{a.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {toAccount && <Text style={styles.balanceHint}>Balance: {formatCurrency(toAccount.balance, toAccount.currency)}</Text>}

      <Text style={styles.label}>Amount</Text>
      <TextInput style={styles.amountInput} placeholder="0.00" placeholderTextColor={Colors.textLight} value={amount} onChangeText={setAmount} keyboardType="numeric" />

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput style={styles.input} placeholder="Transfer note" placeholderTextColor={Colors.textLight} value={description} onChangeText={setDescription} />

      <TouchableOpacity style={styles.button} onPress={handleTransfer} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Transfer</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8, marginTop: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  balanceHint: { fontSize: 12, color: Colors.textSecondary, marginTop: 6 },
  arrowContainer: { alignItems: 'center', marginVertical: 8 },
  amountInput: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 56, fontSize: 24, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  input: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 48, fontSize: 15, color: Colors.text },
  button: { backgroundColor: Colors.transfer, borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
