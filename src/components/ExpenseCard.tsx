import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Egreso } from '../database/types';
import { formatCurrency, formatDate } from '../utils/format';
import colors from '../theme/colors';

const CATEGORIA_LABELS: Record<string, string> = {
  servicios: 'Servicios',
  alquiler: 'Alquiler',
  insumos: 'Insumos',
  otros: 'Otros',
};

const CATEGORIA_COLORS: Record<string, string> = {
  servicios: '#3182CE',
  alquiler: '#D69E2E',
  insumos: '#805AD5',
  otros: '#718096',
};

interface Props {
  egreso: Egreso;
  onPress: (egreso: Egreso) => void;
}

const ExpenseCard: React.FC<Props> = ({ egreso, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(egreso)}>
    <View style={styles.left}>
      <View
        style={[
          styles.categoryBadge,
          { backgroundColor: CATEGORIA_COLORS[egreso.categoria] + '20' },
        ]}>
        <Text
          style={[
            styles.categoryText,
            { color: CATEGORIA_COLORS[egreso.categoria] },
          ]}>
          {CATEGORIA_LABELS[egreso.categoria]}
        </Text>
      </View>
      {egreso.descripcion && (
        <Text style={styles.description}>{egreso.descripcion}</Text>
      )}
      <Text style={styles.date}>{formatDate(egreso.fecha)}</Text>
    </View>
    <Text style={styles.amount}>{formatCurrency(egreso.monto)}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  left: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.danger,
  },
});

export default ExpenseCard;
