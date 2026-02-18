import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Debt } from '../types';
import { Colors } from '../theme/colors';
import { formatCurrency, formatDate } from '../utils/format';

interface Props {
  debt: Debt;
  onClose?: () => void;
  onPress?: () => void;
}

export default function DebtCard({ debt, onClose, onPress }: Props) {
  const isDebt = debt.type === 'DEBT';
  const color = isDebt ? Colors.expense : Colors.income;
  const isOpen = debt.status === 'OPEN';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.iconWrapper, { backgroundColor: color + '15' }]}>
          <Ionicons name={isDebt ? 'arrow-up' : 'arrow-down'} size={20} color={color} />
        </View>
        <View style={styles.info}>
          <Text style={styles.person}>{debt.person_name}</Text>
          {debt.description && <Text style={styles.desc} numberOfLines={1}>{debt.description}</Text>}
        </View>
        <View style={[styles.badge, { backgroundColor: isOpen ? Colors.warning + '20' : Colors.secondary + '20' }]}>
          <Text style={[styles.badgeText, { color: isOpen ? Colors.warning : Colors.secondary }]}>
            {debt.status}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={[styles.amount, { color }]}>{formatCurrency(debt.amount, debt.currency)}</Text>
        {debt.due_date && <Text style={styles.dueDate}>Due: {formatDate(debt.due_date)}</Text>}
      </View>
      {isOpen && onClose && (
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Mark as Closed</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  person: { fontSize: 15, fontWeight: '600', color: Colors.text },
  desc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  amount: { fontSize: 18, fontWeight: '700' },
  dueDate: { fontSize: 12, color: Colors.textSecondary },
  closeBtn: {
    marginTop: 12,
    backgroundColor: Colors.secondary + '15',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  closeBtnText: { color: Colors.secondary, fontWeight: '600', fontSize: 13 },
});
