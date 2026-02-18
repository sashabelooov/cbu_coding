import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Transaction } from '../types';
import { getTransactions } from '../api/transactions';
import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';

const FILTERS = ['ALL', 'INCOME', 'EXPENSE', 'TRANSFER'];

export default function TransactionsScreen({ navigation }: any) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = useCallback(async (pageNum = 1, append = false) => {
    try {
      const params: any = { page: pageNum, size: 20 };
      if (filter !== 'ALL') params.type = filter;
      const data = await getTransactions(params);
      setTransactions(append ? (prev) => [...prev, ...data.items] : data.items);
      setTotal(data.total);
      setPage(pageNum);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => { fetchTransactions(1); }, [fetchTransactions]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => fetchTransactions(1));
    return unsubscribe;
  }, [navigation, fetchTransactions]);

  const onRefresh = () => { setRefreshing(true); fetchTransactions(1); };
  const onEndReached = () => { if (transactions.length < total) fetchTransactions(page + 1, true); };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={<EmptyState icon="receipt-outline" message="No transactions found" />}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTransaction')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  filterActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  fab: {
    position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
});
