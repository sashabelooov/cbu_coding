import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main screens
import DashboardScreen from '../screens/DashboardScreen';
import AccountsScreen from '../screens/AccountsScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import TransferScreen from '../screens/TransferScreen';
import DebtsScreen from '../screens/DebtsScreen';
import AddDebtScreen from '../screens/AddDebtScreen';
import BudgetsScreen from '../screens/BudgetsScreen';
import AddBudgetScreen from '../screens/AddBudgetScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import CalendarScreen from '../screens/CalendarScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: Colors.surface, elevation: 0, shadowOpacity: 0 },
  headerTintColor: Colors.text,
  headerTitleStyle: { fontWeight: '600' as const },
};

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} options={{ title: 'Dashboard' }} />
    </Stack.Navigator>
  );
}

function AccountsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="AccountsList" component={AccountsScreen} options={{ title: 'Accounts' }} />
      <Stack.Screen name="AddAccount" component={AddAccountScreen} options={{ title: 'Add Account' }} />
    </Stack.Navigator>
  );
}

function TransactionsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="TransactionsList" component={TransactionsScreen} options={{ title: 'Transactions' }} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Transaction' }} />
    </Stack.Navigator>
  );
}

function DebtsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="DebtsList" component={DebtsScreen} options={{ title: 'Debts' }} />
      <Stack.Screen name="AddDebt" component={AddDebtScreen} options={{ title: 'Add Debt' }} />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="BudgetsHome" component={BudgetsScreen} options={{ title: 'Budgets' }} />
      <Stack.Screen name="AddBudget" component={AddBudgetScreen} options={{ title: 'Add Budget' }} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
      <Stack.Screen name="Transfer" component={TransferScreen} options={{ title: 'Transfer' }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderLight,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Transactions') iconName = 'swap-horizontal';
          else if (route.name === 'Accounts') iconName = 'wallet';
          else if (route.name === 'Debts') iconName = 'document-text';
          else if (route.name === 'More') iconName = 'grid';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Transactions" component={TransactionsStack} />
      <Tab.Screen name="Accounts" component={AccountsStack} />
      <Tab.Screen name="Debts" component={DebtsStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isGuest, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {(isAuthenticated || isGuest) ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
