import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { Category } from '../types';
import { getCategories } from '../api/categories';
import { createBudget } from '../api/budgets';

export default function AddBudgetScreen({ navigation, route }: any) {
  const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = route?.params || {};
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories(type).then(setCategories).catch(console.error);
    setSelectedCategory('');
  }, [type]);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Please enter a valid amount'); return; }
    setLoading(true);
    try {
      await createBudget({
        category_id: selectedCategory || undefined,
        type,
        month,
        year,
        planned_amount: parseFloat(amount),
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to create budget');
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.toggleRow}>
        <TouchableOpacity style={[styles.toggle, type === 'EXPENSE' && { backgroundColor: Colors.expense }]} onPress={() => setType('EXPENSE')}>
          <Text style={[styles.toggleText, type === 'EXPENSE' && { color: '#fff' }]}>Expense Budget</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggle, type === 'INCOME' && { backgroundColor: Colors.income }]} onPress={() => setType('INCOME')}>
          <Text style={[styles.toggleText, type === 'INCOME' && { color: '#fff' }]}>Income Budget</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Category (optional - leave empty for overall)</Text>
      <View style={styles.chipRow}>
        {categories.map((c) => (
          <TouchableOpacity key={c.id} style={[styles.chip, selectedCategory === c.id && styles.chipActive]} onPress={() => setSelectedCategory(selectedCategory === c.id ? '' : c.id)}>
            <Text style={[styles.chipText, selectedCategory === c.id && styles.chipTextActive]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Planned Amount</Text>
      <TextInput style={styles.amountInput} placeholder="0.00" placeholderTextColor={Colors.textLight} value={amount} onChangeText={setAmount} keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Set Budget</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  toggle: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  toggleText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8, marginTop: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  amountInput: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 56, fontSize: 24, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  button: { backgroundColor: Colors.primary, borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
