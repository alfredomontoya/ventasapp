import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { egresoRepo } from '../database';
import { Egreso, CategoriaEgreso } from '../database/types';
import { todayISO } from '../utils/format';
import colors from '../theme/colors';

const CATEGORIAS: { key: CategoriaEgreso; label: string }[] = [
  { key: 'servicios', label: 'Servicios' },
  { key: 'alquiler', label: 'Alquiler' },
  { key: 'insumos', label: 'Insumos' },
  { key: 'otros', label: 'Otros' },
];

const ExpenseFormScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const existing: Egreso | undefined = route.params?.egreso;
  const isEdit = !!existing;

  const [categoria, setCategoria] = useState<CategoriaEgreso>(
    existing?.categoria ?? 'servicios',
  );
  const [monto, setMonto] = useState(existing?.monto?.toString() ?? '');
  const [descripcion, setDescripcion] = useState(
    existing?.descripcion ?? '',
  );
  const [fecha, setFecha] = useState(
    existing?.fecha ? new Date(existing.fecha) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await egresoRepo.actualizar(existing!.id, {
          categoria,
          monto: montoNum,
          descripcion: descripcion.trim() || undefined,
          fecha: fecha.toISOString().slice(0, 10),
        });
      } else {
        await egresoRepo.crear({
          categoria,
          monto: montoNum,
          descripcion: descripcion.trim() || undefined,
          fecha: fecha.toISOString().slice(0, 10),
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el egreso');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Categoría *</Text>
      <View style={styles.categoriasRow}>
        {CATEGORIAS.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.catChip,
              categoria === cat.key && styles.catChipActive,
            ]}
            onPress={() => setCategoria(cat.key)}>
            <Text
              style={[
                styles.catChipText,
                categoria === cat.key && styles.catChipTextActive,
              ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Monto *</Text>
      <TextInput
        style={styles.input}
        value={monto}
        onChangeText={setMonto}
        placeholder="0"
        placeholderTextColor={colors.disabled}
        keyboardType="decimal-pad"
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

      <Text style={styles.label}>Fecha</Text>
      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>
          {fecha.toLocaleDateString('es-PY')}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) setFecha(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}>
        <Text style={styles.saveBtnText}>
          {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Registrar Egreso'}
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
  categoriasRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  catChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  catChipActive: {
    backgroundColor: colors.danger,
  },
  catChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  catChipTextActive: {
    color: colors.white,
    fontWeight: '600',
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
  dateBtn: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.danger,
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

export default ExpenseFormScreen;
