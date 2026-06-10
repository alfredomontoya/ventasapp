import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { clienteRepo } from '../database';
import { Cliente } from '../database/types';
import ClientCard from '../components/ClientCard';
import colors from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Clients'>;

const ClientsScreen: React.FC<Props> = ({ navigation }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadClientes = useCallback(async () => {
    const data = query.trim()
      ? await clienteRepo.buscar(query)
      : await clienteRepo.listar();
    setClientes(data);
  }, [query]);

  useFocusEffect(
    useCallback(() => {
      loadClientes();
    }, [loadClientes]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClientes();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar clientes..."
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={loadClientes}
      />

      <FlatList
        data={clientes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ClientCard
            cliente={item}
            onPress={cliente =>
              navigation.navigate('ClientDetail', { clienteId: cliente.id })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay clientes</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={clientes.length === 0 && styles.emptyContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ClientForm')}>
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
  search: {
    backgroundColor: colors.card,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
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

export default ClientsScreen;
