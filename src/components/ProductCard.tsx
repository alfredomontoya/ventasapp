import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Producto } from '../database/types';
import { formatCurrency } from '../utils/format';
import colors from '../theme/colors';

interface Props {
  producto: Producto;
  onPress: (producto: Producto) => void;
}

const ProductCard: React.FC<Props> = ({ producto, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(producto)}>
    <View style={styles.info}>
      <Text style={styles.name}>{producto.nombre}</Text>
      <Text style={styles.price}>{formatCurrency(producto.precio)}</Text>
    </View>
    <View
      style={[
        styles.stockBadge,
        producto.stock <= 5 && styles.stockLow,
      ]}>
      <Text
        style={[
          styles.stockText,
          producto.stock <= 5 && styles.stockTextLow,
        ]}>
        {producto.stock}
      </Text>
    </View>
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
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  stockBadge: {
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stockLow: {
    backgroundColor: colors.dangerLight + '20',
  },
  stockText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  stockTextLow: {
    color: colors.danger,
  },
});

export default ProductCard;
