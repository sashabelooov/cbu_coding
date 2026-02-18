import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../theme/colors';
import { DailyTotal, Transaction } from '../types';
import { getDailyTotals } from '../api/analytics';
import { getTransactions } from '../api/transactions';
import TransactionItem from '../components/TransactionItem';
import { formatCurrency } from '../utils/format';
import dayjs from 'dayjs';

export default function CalendarScreen() {
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear] = useState(dayjs().year());
  const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [dayTransactions, setDayTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getDailyTotals(month, year).then(setDailyTotals).catch(console.error);
  }, [month, year]);

  useEffect(() => {
    if (selectedDate) {
      getTransactions({ date_from: selectedDate, date_to: selectedDate, size: 50 })
        .then((data) => setDayTransactions(data.items))
        .catch(console.error);
    }
  }, [selectedDate]);

  const markedDates: any = {};
  dailyTotals.forEach((dt) => {
    const dots = [];
    if (Number(dt.income) > 0) dots.push({ key: 'income', color: Colors.income });
    if (Number(dt.expense) > 0) dots.push({ key: 'expense', color: Colors.expense });
    markedDates[dt.date] = { dots, selected: dt.date === selectedDate, selectedColor: Colors.primary + '20' };
  });
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = { selected: true, selectedColor: Colors.primary + '20' };
  }

  const selectedTotal = dailyTotals.find((d) => d.date === selectedDate);

  return (
    <View style={styles.container}>
      <Calendar
        markingType="multi-dot"
        markedDates={markedDates}
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        onMonthChange={(m: any) => { setMonth(m.month); setYear(m.year); }}
        theme={{
          backgroundColor: Colors.background,
          calendarBackground: Colors.surface,
          textSectionTitleColor: Colors.textSecondary,
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: '#fff',
          todayTextColor: Colors.primary,
          dayTextColor: Colors.text,
          arrowColor: Colors.primary,
          monthTextColor: Colors.text,
          textMonthFontWeight: '600',
        }}
        style={styles.calendar}
      />

      {selectedTotal && (
        <View style={styles.daySummary}>
          <Text style={[styles.dayAmount, { color: Colors.income }]}>+{formatCurrency(selectedTotal.income)}</Text>
          <Text style={[styles.dayAmount, { color: Colors.expense }]}>-{formatCurrency(selectedTotal.expense)}</Text>
        </View>
      )}

      <FlatList
        data={dayTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions on this day</Text>}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  calendar: { borderRadius: 12, marginHorizontal: 16, marginTop: 8, elevation: 1 },
  daySummary: { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingVertical: 12 },
  dayAmount: { fontSize: 15, fontWeight: '600' },
  list: { flex: 1 },
  emptyText: { textAlign: 'center', paddingVertical: 24, color: Colors.textSecondary, fontSize: 14 },
});
