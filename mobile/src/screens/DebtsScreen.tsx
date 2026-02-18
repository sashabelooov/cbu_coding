import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Debt } from '../types';
import { getDebts, closeDebt } from '../api/debts';
import DebtCard from '../components/DebtCard';
import EmptyState from '../components/EmptyState';

export default function DebtsScreen({ navigation }: any) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [tab, setTab] = useState<'DEBT' | 'RECEIVABLE'>('DEBT');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDebts = useCallback(async () => {
    try {
      const data = await getDebts(tab);
      setDebts(data);
    } catch (error) { console.error(error); }
    finally { setRefreshing(false); }
  }, [tab]);

  useEffect(() => { fetchDebts(); }, [fetchDebts]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchDebts);
    return unsubscribe;
  }, [navigation, fetchDebts]);

  const handleClose = (id: string) => {
    Alert.alert('Close Debt', 'Mark this as closed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Close', onPress: async () => {
        try { await closeDebt(id); fetchDebts(); } catch { Alert.alert('Error', 'Failed to close debt'); }
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'DEBT' && styles.tabActive]} onPress={() => setTab('DEBT')}>
          <Text style={[styles.tabText, tab === 'DEBT' && styles.tabTextActive]}>My Debts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'RECEIVABLE' && styles.tabActive]} onPress={() => setTab('RECEIVABLE')}>
          <Text style={[styles.tabText, tab === 'RECEIVABLE' && styles.tabTextActive]}>Receivables</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DebtCard debt={item} onClose={() => handleClose(item.id)} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDebts(); }} colors={[Colors.primary]} />}
        ListEmptyComponent={<EmptyState icon="document-text-outline" message={`No ${tab === 'DEBT' ? 'debts' : 'receivables'} yet`} />}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddDebt', { defaultType: tab })}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: '#fff' },
  list: { padding: 16 },
  fab: {
    position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
});
