import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { BudgetComparison } from '../types';
import { getBudgetComparison } from '../api/budgets';
import BudgetProgressItem from '../components/BudgetProgress';
import EmptyState from '../components/EmptyState';
import dayjs from 'dayjs';

export default function BudgetsScreen({ navigation }: any) {
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear] = useState(dayjs().year());
  const [comparisons, setComparisons] = useState<BudgetComparison[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await getBudgetComparison(month, year);
      setComparisons(data);
    } catch (error) { console.error(error); }
    finally { setRefreshing(false); }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, fetchData]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); } else { setMonth(month - 1); }
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); } else { setMonth(month + 1); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={prevMonth}><Ionicons name="chevron-back" size={24} color={Colors.text} /></TouchableOpacity>
        <Text style={styles.monthText}>{dayjs().month(month - 1).format('MMMM')} {year}</Text>
        <TouchableOpacity onPress={nextMonth}><Ionicons name="chevron-forward" size={24} color={Colors.text} /></TouchableOpacity>
      </View>

      <FlatList
        data={comparisons}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <BudgetProgressItem item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={[Colors.primary]} />}
        ListEmptyComponent={<EmptyState icon="pie-chart-outline" message="No budgets set for this month" />}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddBudget', { month, year })}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  monthText: { fontSize: 17, fontWeight: '600', color: Colors.text },
  list: { padding: 16 },
  fab: {
    position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
});
