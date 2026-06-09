import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Venta } from '../database/types';
import { formatCurrency, formatDateTime } from '../utils/format';
import colors from '../theme/colors';

interface Props {
  venta: Venta;
  clienteNombre?: string;
  onPress: (venta: Venta) => void;
}

const SaleItem: React.FC<Props> = ({ venta, clienteNombre, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(venta)}>
    <View style={styles.info}>
      <Text style={styles.total}>{formatCurrency(venta.total)}</Text>
      <Text style={styles.client}>
        {clienteNombre ?? `Cliente #${venta.clienteId}`}
      </Text>
      <Text style={styles.date}>{formatDateTime(venta.fecha)}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  client: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default SaleItem;
