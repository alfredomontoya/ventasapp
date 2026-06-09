import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../utils/format';
import colors from '../theme/colors';

interface Props {
  title: string;
  value: number;
  color?: string;
}

const DashboardCard: React.FC<Props> = ({ title, value, color }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={[styles.value, { color: color ?? colors.text }]}>
      {formatCurrency(value)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default DashboardCard;
