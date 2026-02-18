import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, AccountTypeColors } from '../theme/colors';
import { Account } from '../types';
import { getAccounts, deleteAccount } from '../api/accounts';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../utils/format';

const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  CARD: 'card-outline', BANK: 'business-outline', CASH: 'cash-outline', E_WALLET: 'phone-portrait-outline',
};

export default function AccountsScreen({ navigation }: any) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchAccounts);
    return unsubscribe;
  }, [navigation, fetchAccounts]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Account', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await deleteAccount(id); fetchAccounts(); } catch { Alert.alert('Error', 'Failed to delete account'); }
      }},
    ]);
  };

  const renderItem = ({ item }: { item: Account }) => {
    const color = item.color || AccountTypeColors[item.type] || Colors.primary;
    return (
      <View style={[styles.card, { borderLeftColor: color }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: color + '20' }]}>
            <Ionicons name={typeIcons[item.type] || 'wallet-outline'} size={22} color={color} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardType}>{item.type.replace('_', ' ')} · {item.currency}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
            <Ionicons name="trash-outline" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.cardBalance, { color }]}>{formatCurrency(item.balance, item.currency)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAccounts(); }} colors={[Colors.primary]} />}
        ListEmptyComponent={<EmptyState icon="wallet-outline" message="No accounts yet. Add your first account!" />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddAccount')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '600', color: Colors.text },
  cardType: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  cardBalance: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  fab: {
    position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
});
