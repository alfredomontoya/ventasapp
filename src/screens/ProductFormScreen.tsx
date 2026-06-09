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
import { productoRepo } from '../database';
import { Producto } from '../database/types';
import colors from '../theme/colors';

const ProductFormScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const existing: Producto | undefined = route.params?.producto;
  const isEdit = !!existing;

  const [nombre, setNombre] = useState(existing?.nombre ?? '');
  const [precio, setPrecio] = useState(
    existing?.precio?.toString() ?? '',
  );
  const [stock, setStock] = useState(
    existing?.stock?.toString() ?? '0',
  );
  const [descripcion, setDescripcion] = useState(
    existing?.descripcion ?? '',
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      Alert.alert('Error', 'Ingresa un precio válido');
      return;
    }
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      Alert.alert('Error', 'Ingresa un stock válido');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await productoRepo.actualizar(existing!.id, {
          nombre: nombre.trim(),
          precio: precioNum,
          stock: stockNum,
          descripcion: descripcion.trim() || undefined,
        });
      } else {
        await productoRepo.crear({
          nombre: nombre.trim(),
          precio: precioNum,
          stock: stockNum,
          descripcion: descripcion.trim() || undefined,
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el producto');
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
        placeholder="Nombre del producto"
        placeholderTextColor={colors.disabled}
      />

      <Text style={styles.label}>Precio *</Text>
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        placeholder="0"
        placeholderTextColor={colors.disabled}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Stock *</Text>
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        placeholder="0"
        placeholderTextColor={colors.disabled}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción opcional"
        placeholderTextColor={colors.disabled}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}>
        <Text style={styles.saveBtnText}>
          {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Producto'}
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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

export default ProductFormScreen;
