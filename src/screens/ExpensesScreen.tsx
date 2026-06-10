import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { egresoRepo } from '../database';
import { Egreso, CategoriaEgreso } from '../database/types';
import ExpenseCard from '../components/ExpenseCard';
import colors from '../theme/colors';

const CATEGORIAS: { key: CategoriaEgreso | 'todas'; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'servicios', label: 'Servicios' },
  { key: 'alquiler', label: 'Alquiler' },
  { key: 'insumos', label: 'Insumos' },
  { key: 'otros', label: 'Otros' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Expenses'>;

const ExpensesScreen: React.FC<Props> = ({ navigation }) => {
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<
    CategoriaEgreso | 'todas'
  >('todas');
  const [refreshing, setRefreshing] = useState(false);

  const loadEgresos = useCallback(async () => {
    const data =
      filtroCategoria === 'todas'
        ? await egresoRepo.listar()
        : await egresoRepo.listarPorCategoria(filtroCategoria);
    setEgresos(data);
  }, [filtroCategoria]);

  useFocusEffect(
    useCallback(() => {
      loadEgresos();
    }, [loadEgresos]),
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.chipsRow}>
            {CATEGORIAS.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.chip,
                  filtroCategoria === cat.key && styles.chipActive,
                ]}
                onPress={() => setFiltroCategoria(cat.key)}>
                <Text
                  style={[
                    styles.chipText,
                    filtroCategoria === cat.key && styles.chipTextActive,
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        }
        data={egresos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseCard
            egreso={item}
            onPress={e =>
              navigation.navigate('ExpenseForm', { egreso: e })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay egresos registrados</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await loadEgresos();
              setRefreshing(false);
            }}
          />
        }
        contentContainerStyle={egresos.length === 0 && styles.emptyContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ExpenseForm')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.border,
    marginRight: 6,
    marginBottom: 4,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 32,
    fontSize: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: colors.white,
    lineHeight: 30,
  },
});

export default ExpensesScreen;
