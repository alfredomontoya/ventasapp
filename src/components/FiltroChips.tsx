import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import colors from '../theme/colors';

type Filtro = 'hoy' | 'semana' | 'mes' | 'rango';

interface Props {
  active: Filtro;
  onChange: (filtro: Filtro) => void;
  onRangePress?: () => void;
}

const CHIPS: { key: Filtro; label: string }[] = [
  { key: 'hoy', label: 'Hoy' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mes' },
  { key: 'rango', label: 'Rango' },
];

const FiltroChips: React.FC<Props> = ({ active, onChange, onRangePress }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.container}>
    {CHIPS.map(chip => (
      <TouchableOpacity
        key={chip.key}
        style={[styles.chip, active === chip.key && styles.chipActive]}
        onPress={() => {
          if (chip.key === 'rango') {
            onRangePress?.();
          } else {
            onChange(chip.key);
          }
        }}>
        <Text
          style={[
            styles.chipText,
            active === chip.key && styles.chipTextActive,
          ]}>
          {chip.label}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default FiltroChips;
