import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { clienteRepo, productoRepo, ventaRepo } from '../database';
import { Cliente, Producto } from '../database/types';
import { formatCurrency, todayISO } from '../utils/format';
import colors from '../theme/colors';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'SaleForm'>;

const SaleFormScreen: React.FC<Props> = ({ navigation }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteSel, setClienteSel] = useState<Cliente | null>(null);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [queryCliente, setQueryCliente] = useState('');
  const [queryProducto, setQueryProducto] = useState('');
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<'cliente' | 'productos' | 'resumen'>('cliente');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [c, p] = await Promise.all([
      clienteRepo.listar(),
      productoRepo.listar(),
    ]);
    setClientes(c);
    setProductos(p);
  };

  const toggleProducto = (producto: Producto) => {
    const existing = carrito.find(c => c.producto.id === producto.id);
    if (existing) {
      setCarrito(prev =>
        prev.map(c =>
          c.producto.id === producto.id
            ? { ...c, cantidad: c.cantidad + 1 }
            : c,
        ),
      );
    } else {
      setCarrito(prev => [...prev, { producto, cantidad: 1 }]);
    }
  };

  const updateCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      setCarrito(prev => prev.filter(c => c.producto.id !== productoId));
    } else {
      setCarrito(prev =>
        prev.map(c =>
          c.producto.id === productoId ? { ...c, cantidad } : c,
        ),
      );
    }
  };

  const total = carrito.reduce(
    (sum, c) => sum + c.producto.precio * c.cantidad,
    0,
  );

  const handleSave = async () => {
    if (!clienteSel) {
      Alert.alert('Error', 'Selecciona un cliente');
      return;
    }
    if (carrito.length === 0) {
      Alert.alert('Error', 'Agrega al menos un producto');
      return;
    }

    setSaving(true);
    try {
      await ventaRepo.crear(
        {
          clienteId: clienteSel.id,
          total,
          fecha: todayISO(),
        },
        carrito.map(c => ({
          productoId: c.producto.id,
          cantidad: c.cantidad,
          precioUnitario: c.producto.precio,
        })),
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la venta');
    } finally {
      setSaving(false);
    }
  };

  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(queryCliente.toLowerCase()),
  );
  const filteredProductos = productos.filter(
    p =>
      p.nombre.toLowerCase().includes(queryProducto.toLowerCase()) &&
      !carrito.find(c => c.producto.id === p.id),
  );

  return (
    <View style={styles.container}>
      {/* Step indicator */}
      <View style={styles.steps}>
        {['cliente', 'productos', 'resumen'].map((s, i) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.step,
              step === s && styles.stepActive,
              i < ['cliente', 'productos', 'resumen'].indexOf(step) &&
                styles.stepDone,
            ]}
            onPress={() => setStep(s as any)}>
            <Text
              style={[
                styles.stepText,
                step === s && styles.stepTextActive,
              ]}>
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {step === 'cliente' && (
        <>
          <TextInput
            style={styles.search}
            placeholder="Buscar cliente..."
            placeholderTextColor={colors.disabled}
            value={queryCliente}
            onChangeText={setQueryCliente}
          />
          <FlatList
            data={filteredClientes}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.option,
                  clienteSel?.id === item.id && styles.optionSelected,
                ]}
                onPress={() => {
                  setClienteSel(item);
                  setStep('productos');
                }}>
                <Text style={styles.optionText}>{item.nombre}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {step === 'productos' && (
        <>
          <TextInput
            style={styles.search}
            placeholder="Buscar producto..."
            placeholderTextColor={colors.disabled}
            value={queryProducto}
            onChangeText={setQueryProducto}
          />
          <FlatList
            data={filteredProductos}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => toggleProducto(item)}>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionText}>{item.nombre}</Text>
                  <Text style={styles.optionSub}>
                    {formatCurrency(item.precio)} — Stock: {item.stock}
                  </Text>
                </View>
                <Text style={styles.addText}>+</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              carrito.length > 0 ? (
                <TouchableOpacity
                  style={styles.nextBtn}
                  onPress={() => setStep('resumen')}>
                  <Text style={styles.nextBtnText}>
                    Ver resumen ({carrito.length} productos)
                  </Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </>
      )}

      {step === 'resumen' && (
        <ScrollView style={styles.resumen}>
          <Text style={styles.sectionTitle}>
            Cliente: {clienteSel?.nombre}
          </Text>

          {carrito.map(c => (
            <View key={c.producto.id} style={styles.carritoItem}>
              <View style={styles.carritoInfo}>
                <Text style={styles.carritoName}>{c.producto.nombre}</Text>
                <Text style={styles.carritoPrice}>
                  {formatCurrency(c.producto.precio)} x {c.cantidad}
                </Text>
              </View>
              <View style={styles.cantidadControl}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateCantidad(c.producto.id, c.cantidad - 1)}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{c.cantidad}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateCantidad(c.producto.id, c.cantidad + 1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Text style={styles.total}>
            Total: {formatCurrency(total)}
          </Text>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}>
            <Text style={styles.saveBtnText}>
              {saving ? 'Guardando...' : 'Confirmar Venta'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  stepDone: {
    backgroundColor: colors.success,
  },
  stepText: {
    color: colors.textSecondary,
    fontWeight: '700',
  },
  stepTextActive: {
    color: colors.white,
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 10,
  },
  optionSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  optionInfo: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  optionSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: colors.primary,
    margin: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  resumen: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  carritoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  carritoInfo: {
    flex: 1,
  },
  carritoName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  carritoPrice: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cantidadControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  total: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 16,
  },
  saveBtn: {
    backgroundColor: colors.success,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
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

export default SaleFormScreen;
