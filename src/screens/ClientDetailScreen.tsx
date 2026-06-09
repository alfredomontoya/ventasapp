import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { clienteRepo, ventaRepo } from '../database';
import { Cliente, Venta } from '../database/types';
import { formatCurrency, formatDate } from '../utils/format';
import SaleItem from '../components/SaleItem';
import colors from '../theme/colors';

const ClientDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { clienteId } = route.params;
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [c, v] = await Promise.all([
      clienteRepo.obtenerPorId(clienteId),
      ventaRepo.listarPorCliente(clienteId),
    ]);
    setCliente(c);
    setVentas(v);
  }, [clienteId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleDelete = () => {
    Alert.alert(
      'Eliminar cliente',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await clienteRepo.eliminar(clienteId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (!cliente) {
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
          <>
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {cliente.nombre.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.name}>{cliente.nombre}</Text>
              {cliente.telefono && (
                <Text style={styles.detail}>📞 {cliente.telefono}</Text>
              )}
              {cliente.email && (
                <Text style={styles.detail}>✉️ {cliente.email}</Text>
              )}
              {cliente.direccion && (
                <Text style={styles.detail}>📍 {cliente.direccion}</Text>
              )}
              <Text style={styles.dateText}>
                Registrado: {formatDate(cliente.createdAt)}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() =>
                    navigation.navigate('ClientForm', { cliente })
                  }>
                  <Text style={styles.editBtnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={handleDelete}>
                  <Text style={styles.deleteBtnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              Historial de Ventas ({ventas.length})
            </Text>
          </>
        }
        data={ventas}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SaleItem
            venta={item}
            clienteNombre={cliente.nombre}
            onPress={v => navigation.navigate('SaleDetail', { ventaId: v.id })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Sin ventas registradas</Text>
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
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    marginBottom: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: colors.disabled,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  editBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editBtnText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  deleteBtn: {
    backgroundColor: colors.danger,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 32,
    fontSize: 16,
  },
});

export default ClientDetailScreen;
