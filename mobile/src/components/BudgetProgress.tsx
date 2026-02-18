import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BudgetComparison } from '../types';
import { Colors } from '../theme/colors';
import { formatCurrency } from '../utils/format';

interface Props {
  item: BudgetComparison;
}

export default function BudgetProgressItem({ item }: Props) {
  const isOver = item.percentage > 100;
  const progressColor = isOver ? Colors.danger : Colors.secondary;
  const progressWidth = Math.min(item.percentage, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.category}>{item.category_name}</Text>
        <Text style={[styles.percentage, { color: progressColor }]}>{item.percentage.toFixed(1)}%</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progressWidth}%`, backgroundColor: progressColor }]} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.actual}>{formatCurrency(item.actual)} spent</Text>
        <Text style={styles.planned}>of {formatCurrency(item.planned)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: { fontSize: 14, fontWeight: '600', color: Colors.text },
  percentage: { fontSize: 14, fontWeight: '700' },
  barBackground: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  actual: { fontSize: 12, color: Colors.textSecondary },
  planned: { fontSize: 12, color: Colors.textLight },
});
