import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { clienteRepo } from '../database';
import { Cliente } from '../database/types';
import { todayISO } from '../utils/format';
import colors from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientForm'>;

const ClientFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const existing: Cliente | undefined = route.params?.cliente;
  const isEdit = !!existing;

  const [nombre, setNombre] = useState(existing?.nombre ?? '');
  const [telefono, setTelefono] = useState(existing?.telefono ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [direccion, setDireccion] = useState(existing?.direccion ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await clienteRepo.actualizar(existing!.id, {
          nombre: nombre.trim(),
          telefono: telefono.trim() || undefined,
          email: email.trim() || undefined,
          direccion: direccion.trim() || undefined,
        });
      } else {
        await clienteRepo.crear({
          nombre: nombre.trim(),
          telefono: telefono.trim() || undefined,
          email: email.trim() || undefined,
          direccion: direccion.trim() || undefined,
          createdAt: todayISO(),
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el cliente');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nombre *</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del cliente"
        placeholderTextColor={colors.disabled}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        placeholder="+595 981 234 567"
        placeholderTextColor={colors.disabled}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="cliente@email.com"
        placeholderTextColor={colors.disabled}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={direccion}
        onChangeText={setDireccion}
        placeholder="Dirección"
        placeholderTextColor={colors.disabled}
      />

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}>
        <Text style={styles.saveBtnText}>
          {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Cliente'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ClientFormScreen;
