import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Account } from '../types';
import { Colors, AccountTypeColors } from '../theme/colors';
import { formatCurrency } from '../utils/format';

const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  CARD: 'card-outline',
  BANK: 'business-outline',
  CASH: 'cash-outline',
  E_WALLET: 'phone-portrait-outline',
};

interface Props {
  account: Account;
  onPress?: () => void;
}

export default function AccountCard({ account, onPress }: Props) {
  const color = account.color || AccountTypeColors[account.type] || Colors.primary;

  return (
    <TouchableOpacity style={[styles.container, { borderLeftColor: color }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.iconWrapper, { backgroundColor: color + '20' }]}>
          <Ionicons name={typeIcons[account.type] || 'wallet-outline'} size={20} color={color} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{account.name}</Text>
          <Text style={styles.type}>{account.type.replace('_', ' ')}</Text>
        </View>
      </View>
      <Text style={[styles.balance, { color }]}>{formatCurrency(account.balance, account.currency)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 180,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  type: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  balance: {
    fontSize: 18,
    fontWeight: '700',
  },
});
