import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { Account, Category } from '../types';
import { getAccounts } from '../api/accounts';
import { getCategories } from '../api/categories';
import { createTransaction } from '../api/transactions';
import dayjs from 'dayjs';

export default function AddTransactionScreen({ navigation }: any) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAccounts().then(setAccounts).catch(console.error);
  }, []);

  useEffect(() => {
    getCategories(type).then(setCategories).catch(console.error);
    setSelectedCategory('');
  }, [type]);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Please enter a valid amount'); return; }
    if (!selectedAccount) { Alert.alert('Error', 'Please select an account'); return; }
    setLoading(true);
    try {
      await createTransaction({
        account_id: selectedAccount,
        category_id: selectedCategory || undefined,
        type,
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        date: dayjs().format('YYYY-MM-DD'),
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Type Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity style={[styles.toggle, type === 'EXPENSE' && { backgroundColor: Colors.expense }]} onPress={() => setType('EXPENSE')}>
          <Text style={[styles.toggleText, type === 'EXPENSE' && { color: '#fff' }]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggle, type === 'INCOME' && { backgroundColor: Colors.income }]} onPress={() => setType('INCOME')}>
          <Text style={[styles.toggleText, type === 'INCOME' && { color: '#fff' }]}>Income</Text>
        </TouchableOpacity>
      </View>

      {/* Amount */}
      <Text style={styles.label}>Amount</Text>
      <TextInput style={styles.amountInput} placeholder="0.00" placeholderTextColor={Colors.textLight} value={amount} onChangeText={setAmount} keyboardType="numeric" />

      {/* Account */}
      <Text style={styles.label}>Account</Text>
      <View style={styles.chipRow}>
        {accounts.map((a) => (
          <TouchableOpacity key={a.id} style={[styles.chip, selectedAccount === a.id && styles.chipActive]} onPress={() => setSelectedAccount(a.id)}>
            <Text style={[styles.chipText, selectedAccount === a.id && styles.chipTextActive]}>{a.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {categories.map((c) => (
          <TouchableOpacity key={c.id} style={[styles.chip, selectedCategory === c.id && styles.chipActive]} onPress={() => setSelectedCategory(c.id)}>
            <Text style={[styles.chipText, selectedCategory === c.id && styles.chipTextActive]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}
      <Text style={styles.label}>Description (optional)</Text>
      <TextInput style={styles.input} placeholder="What was this for?" placeholderTextColor={Colors.textLight} value={description} onChangeText={setDescription} />

      <TouchableOpacity style={[styles.button, { backgroundColor: type === 'EXPENSE' ? Colors.expense : Colors.income }]} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add {type === 'EXPENSE' ? 'Expense' : 'Income'}</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  toggle: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  toggleText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8, marginTop: 16 },
  amountInput: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 56, fontSize: 24, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  input: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 48, fontSize: 15, color: Colors.text },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  button: { borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
