import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { Colors } from '../theme/colors';
import { formatCurrency, formatShortDate } from '../utils/format';

const typeConfig = {
  INCOME: { color: Colors.income, icon: 'arrow-down-circle' as const, sign: '+' },
  EXPENSE: { color: Colors.expense, icon: 'arrow-up-circle' as const, sign: '-' },
  TRANSFER: { color: Colors.transfer, icon: 'swap-horizontal' as const, sign: '' },
};

interface Props {
  transaction: Transaction;
  onPress?: () => void;
}

export default function TransactionItem({ transaction, onPress }: Props) {
  const config = typeConfig[transaction.type];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconWrapper, { backgroundColor: config.color + '15' }]}>
        <Ionicons name={config.icon} size={22} color={config.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description || transaction.category?.name || transaction.type}
        </Text>
        <Text style={styles.meta}>
          {transaction.category?.name ? `${transaction.category.name} · ` : ''}
          {formatShortDate(transaction.date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: config.color }]}>
        {config.sign}{formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
});
