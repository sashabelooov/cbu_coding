import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Colors } from '../theme/colors';
import { AnalyticsSummary, CategoryBreakdown } from '../types';
import { getSummary, getByCategory } from '../api/analytics';
import StatCard from '../components/StatCard';
import { formatCurrency } from '../utils/format';

const screenWidth = Dimensions.get('window').width;
const PERIODS = ['week', 'month', 'year'];

const chartConfig = {
  backgroundColor: Colors.surface,
  backgroundGradientFrom: Colors.surface,
  backgroundGradientTo: Colors.surface,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: () => Colors.textSecondary,
  decimalPlaces: 0,
  propsForLabels: { fontSize: 11 },
};

const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState('month');
  const [summary, setSummary] = useState<AnalyticsSummary>({ total_income: 0, total_expense: 0, balance: 0 });
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sum, expenses, incomes] = await Promise.all([
          getSummary(period),
          getByCategory('EXPENSE'),
          getByCategory('INCOME'),
        ]);
        setSummary(sum);
        setExpenseBreakdown(expenses);
        setIncomeBreakdown(incomes);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [period]);

  const pieData = expenseBreakdown.map((item, i) => ({
    name: item.category_name,
    amount: Number(item.amount),
    color: item.category_color || defaultColors[i % defaultColors.length],
    legendFontColor: Colors.textSecondary,
    legendFontSize: 12,
  }));

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <TouchableOpacity key={p} style={[styles.periodChip, period === p && styles.periodActive]} onPress={() => setPeriod(p)}>
            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p.charAt(0).toUpperCase() + p.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsRow}>
        <StatCard title="Income" value={formatCurrency(summary.total_income)} icon="trending-up" color={Colors.income} />
        <View style={{ width: 12 }} />
        <StatCard title="Expense" value={formatCurrency(summary.total_expense)} icon="trending-down" color={Colors.expense} />
      </View>

      {pieData.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expense Breakdown</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 48}
            height={200}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
      )}

      {incomeBreakdown.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Income Sources</Text>
          {incomeBreakdown.map((item, i) => (
            <View key={i} style={styles.breakdownRow}>
              <View style={[styles.dot, { backgroundColor: item.category_color || defaultColors[i % defaultColors.length] }]} />
              <Text style={styles.breakdownName}>{item.category_name}</Text>
              <Text style={styles.breakdownAmount}>{formatCurrency(item.amount)}</Text>
              <Text style={styles.breakdownPct}>{item.percentage}%</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  periodRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 8 },
  periodChip: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  periodActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  periodText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  periodTextActive: { color: '#fff' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16 },
  chartCard: { backgroundColor: Colors.surface, borderRadius: 12, marginHorizontal: 16, marginTop: 16, padding: 16, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  chartTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  breakdownName: { flex: 1, fontSize: 14, color: Colors.text },
  breakdownAmount: { fontSize: 14, fontWeight: '600', color: Colors.text, marginRight: 8 },
  breakdownPct: { fontSize: 12, color: Colors.textSecondary, width: 40, textAlign: 'right' },
});
