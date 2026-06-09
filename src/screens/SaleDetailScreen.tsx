import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ventaRepo, productoRepo, clienteRepo } from '../database';
import { Venta, DetalleVenta, Producto } from '../database/types';
import { formatCurrency, formatDateTime } from '../utils/format';
import colors from '../theme/colors';

const SaleDetailScreen: React.FC<{ route: any }> = ({ route }) => {
  const { ventaId } = route.params;
  const [venta, setVenta] = useState<(Venta & { items: DetalleVenta[] }) | null>(
    null,
  );
  const [productos, setProductos] = useState<Record<number, Producto>>({});
  const [clienteNombre, setClienteNombre] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const v = await ventaRepo.obtenerPorId(ventaId);
    if (!v) return;
    setVenta(v);

    const [prods, cli] = await Promise.all([
      productoRepo.listar(),
      clienteRepo.obtenerPorId(v.clienteId),
    ]);

    const prodMap: Record<number, Producto> = {};
    prods.forEach(p => {
      prodMap[p.id] = p;
    });
    setProductos(prodMap);
    setClienteNombre(cli?.nombre ?? `Cliente #${v.clienteId}`);
  }, [ventaId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  if (!venta) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Venta #{venta.id}</Text>
            <Text style={styles.date}>
              {formatDateTime(venta.fecha)}
            </Text>
            <Text style={styles.client}>Cliente: {clienteNombre}</Text>
            <Text style={styles.total}>
              Total: {formatCurrency(venta.total)}
            </Text>
          </View>
        }
        data={venta.items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const prod = productos[item.productoId];
          return (
            <View style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {prod?.nombre ?? `Producto #${item.productoId}`}
                </Text>
                <Text style={styles.itemDetail}>
                  {formatCurrency(item.precioUnitario)} x {item.cantidad}
                </Text>
              </View>
              <Text style={styles.itemTotal}>
                {formatCurrency(item.precioUnitario * item.cantidad)}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>Sin productos</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await loadData();
              setRefreshing(false);
            }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    padding: 20,
    marginBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  client: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
  },
  total: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  itemDetail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 32,
    fontSize: 16,
  },
});

export default SaleDetailScreen;
