import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import colors from '../theme/colors';

interface Props {
  puntos: { label: string; ingresos: number; egresos: number }[];
}

const screenWidth = Dimensions.get('window').width - 48;

const GraficoIngresosEgresos: React.FC<Props> = ({ puntos }) => {
  if (puntos.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No hay datos para el período seleccionado
        </Text>
      </View>
    );
  }

  const labels = puntos.map(p => p.label);
  const ingresos = puntos.map(p => p.ingresos);
  const egresos = puntos.map(p => p.egresos);

  const data = {
    labels,
    datasets: [
      {
        data: ingresos.length > 0 ? ingresos : [0],
        color: () => colors.primary,
      },
      {
        data: egresos.length > 0 ? egresos : [0],
        color: () => colors.danger,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        width={screenWidth}
        height={220}
        yAxisLabel="Gs "
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: () => colors.textSecondary,
          propsForLabels: { fontSize: 10 },
          barPercentage: 0.6,
        }}
        fromZero
        showValuesOnTopOfBars
        withCustomBarColorFromData
        flatColor
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chart: {
    borderRadius: 12,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default GraficoIngresosEgresos;
