import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Cliente } from '../database/types';
import colors from '../theme/colors';

interface Props {
  cliente: Cliente;
  onPress: (cliente: Cliente) => void;
}

const ClientCard: React.FC<Props> = ({ cliente, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(cliente)}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>
        {cliente.nombre.charAt(0).toUpperCase()}
      </Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{cliente.nombre}</Text>
      {cliente.telefono && <Text style={styles.detail}>{cliente.telefono}</Text>}
      {cliente.email && <Text style={styles.detail}>{cliente.email}</Text>}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  detail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default ClientCard;
