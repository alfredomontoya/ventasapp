import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ventaRepo, clienteRepo } from '../database';
import { Venta } from '../database/types';
import SaleItem from '../components/SaleItem';
import colors from '../theme/colors';

const SalesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [nombreCliente, setNombreCliente] = useState<Record<number, string>>(
    {},
  );
  const [refreshing, setRefreshing] = useState(false);

  const loadVentas = useCallback(async () => {
    const data = await ventaRepo.listar();
    setVentas(data);

    const clientIds = [...new Set(data.map(v => v.clienteId))];
    const nombres: Record<number, string> = {};
    await Promise.all(
      clientIds.map(async id => {
        const c = await clienteRepo.obtenerPorId(id);
        if (c) nombres[id] = c.nombre;
      }),
    );
    setNombreCliente(nombres);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadVentas();
    }, [loadVentas]),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ventas}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SaleItem
            venta={item}
            clienteNombre={nombreCliente[item.clienteId]}
            onPress={v =>
              navigation.navigate('SaleDetail', { ventaId: v.id })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay ventas registradas</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await loadVentas();
              setRefreshing(false);
            }}
          />
        }
        contentContainerStyle={ventas.length === 0 && styles.emptyContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('SaleForm')}>
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
    backgroundColor: colors.primary,
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

export default SalesScreen;
