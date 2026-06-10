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
import { productoRepo } from '../database';
import { Producto } from '../database/types';
import ProductCard from '../components/ProductCard';
import colors from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

const ProductsScreen: React.FC<Props> = ({ navigation }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadProductos = useCallback(async () => {
    const data = query.trim()
      ? await productoRepo.buscar(query)
      : await productoRepo.listar();
    setProductos(data);
  }, [query]);

  useFocusEffect(
    useCallback(() => {
      loadProductos();
    }, [loadProductos]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProductos();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar productos..."
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={loadProductos}
      />

      <FlatList
        data={productos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            producto={item}
            onPress={p =>
              navigation.navigate('ProductForm', { producto: p })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay productos</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={productos.length === 0 && styles.emptyContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ProductForm')}>
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

export default ProductsScreen;
