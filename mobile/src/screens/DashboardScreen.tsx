import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Account, Transaction, AnalyticsSummary } from '../types';
import { getAccounts } from '../api/accounts';
import { getTransactions } from '../api/transactions';
import { getSummary } from '../api/analytics';
import StatCard from '../components/StatCard';
import AccountCard from '../components/AccountCard';
import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../utils/format';

export default function DashboardScreen({ navigation }: any) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({ total_income: 0, total_expense: 0, balance: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [accts, txns, sum] = await Promise.all([
        getAccounts(),
        getTransactions({ page: 1, size: 5 }),
        getSummary('month'),
      ]);
      setAccounts(accts);
      setTransactions(txns.items);
      setSummary(sum);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
    >
      <View style={styles.headerSection}>
        <Text style={styles.greeting}>Overview</Text>
        <Text style={styles.subGreeting}>This month's summary</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard title="Total Balance" value={formatCurrency(totalBalance)} icon="wallet" color={Colors.primary} />
        <View style={{ width: 12 }} />
        <StatCard title="Income" value={formatCurrency(summary.total_income)} icon="trending-up" color={Colors.income} />
      </View>
      <View style={styles.statsRow}>
        <StatCard title="Expense" value={formatCurrency(summary.total_expense)} icon="trending-down" color={Colors.expense} />
        <View style={{ width: 12 }} />
        <StatCard title="Net" value={formatCurrency(summary.balance)} icon="analytics" color={Colors.transfer} />
      </View>

      {/* Accounts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Accounts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {accounts.length > 0 ? (
          <FlatList
            data={accounts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AccountCard account={item} onPress={() => navigation.navigate('Accounts')} />}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 4 }}
          />
        ) : (
          <EmptyState icon="wallet-outline" message="No accounts yet" />
        )}
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsList}>
          {transactions.length > 0 ? (
            transactions.map((t) => <TransactionItem key={t.id} transaction={t} />)
          ) : (
            <EmptyState icon="receipt-outline" message="No transactions yet" />
          )}
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerSection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  greeting: { fontSize: 24, fontWeight: '700', color: Colors.text },
  subGreeting: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12 },
  section: { marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  transactionsList: { backgroundColor: Colors.surface, borderRadius: 12, marginHorizontal: 16, overflow: 'hidden' },
});
