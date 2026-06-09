import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { clienteRepo, productoRepo } from '../database';
import { obtenerResumen } from '../utils/reportes';
import {
  todayISO,
  startOfWeekISO,
  startOfMonthISO,
} from '../utils/format';
import { formatCurrency } from '../utils/format';
import GraficoIngresosEgresos from '../components/GraficoIngresosEgresos';
import FiltroChips from '../components/FiltroChips';
import DashboardCard from '../components/DashboardCard';
import colors from '../theme/colors';

type Filtro = 'hoy' | 'semana' | 'mes' | 'rango';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [filtro, setFiltro] = useState<Filtro>('hoy');
  const [resumen, setResumen] = useState({
    ingresos: 0,
    egresos: 0,
    gananciaNeta: 0,
    puntos: [] as { label: string; ingresos: number; egresos: number }[],
  });
  const [clientesCount, setClientesCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rangoDesde, setRangoDesde] = useState<Date | null>(null);
  const [rangoHasta, setRangoHasta] = useState<Date | null>(null);
  const [datePickerTarget, setDatePickerTarget] = useState<'desde' | 'hasta'>('desde');

  const loadData = useCallback(async () => {
    let desde: string;
    let hasta: string = todayISO();

    if (filtro === 'hoy') {
      desde = hasta;
    } else if (filtro === 'semana') {
      desde = startOfWeekISO();
    } else if (filtro === 'mes') {
      desde = startOfMonthISO();
    } else if (rangoDesde && rangoHasta) {
      desde = rangoDesde.toISOString().slice(0, 10);
      hasta = rangoHasta.toISOString().slice(0, 10);
    } else {
      desde = hasta;
    }

    const [res, cCount, pCount] = await Promise.all([
      obtenerResumen(desde, hasta),
      clienteRepo.contar(),
      productoRepo.contar(),
    ]);

    setResumen(res);
    setClientesCount(cCount);
    setProductosCount(pCount);
  }, [filtro, rangoDesde, rangoHasta]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleRangePress = () => {
    setDatePickerTarget('desde');
    setShowDatePicker(true);
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (!selectedDate) return;

    if (datePickerTarget === 'desde') {
      setRangoDesde(selectedDate);
      setDatePickerTarget('hasta');
      if (Platform.OS === 'ios') {
        setShowDatePicker(true);
      } else {
        setShowDatePicker(true);
      }
    } else {
      setRangoHasta(selectedDate);
      setShowDatePicker(false);
      setFiltro('rango');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.title}>VentasCRM</Text>

      <FiltroChips
        active={filtro}
        onChange={setFiltro}
        onRangePress={handleRangePress}
      />

      {showDatePicker && (
        <DateTimePicker
          value={datePickerTarget === 'desde' ? new Date() : rangoDesde ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <GraficoIngresosEgresos puntos={resumen.puntos} />

      <View style={styles.cardsRow}>
        <DashboardCard
          title="Ingresos"
          value={resumen.ingresos}
          color={colors.primary}
        />
        <DashboardCard
          title="Egresos"
          value={resumen.egresos}
          color={colors.danger}
        />
        <DashboardCard
          title="Ganancia Neta"
          value={resumen.gananciaNeta}
          color={
            resumen.gananciaNeta >= 0 ? colors.success : colors.danger
          }
        />
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.stat}>
          Clientes: <Text style={styles.statBold}>{clientesCount}</Text>
        </Text>
        <Text style={styles.stat}>
          Productos: <Text style={styles.statBold}>{productosCount}</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  stat: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statBold: {
    fontWeight: '700',
    color: colors.text,
  },
});

export default HomeScreen;
