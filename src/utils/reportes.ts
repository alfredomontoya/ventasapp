import { ventaRepo, egresoRepo } from '../database';
import { format } from 'date-fns';

export interface ResumenPeriodo {
  ingresos: number;
  egresos: number;
  gananciaNeta: number;
  puntos: { label: string; ingresos: number; egresos: number }[];
}

export async function obtenerResumen(
  desde: string,
  hasta: string,
): Promise<ResumenPeriodo> {
  const [totalIngresos, totalEgresos, ingresosPorDia, egresosPorDia] =
    await Promise.all([
      ventaRepo.totalIngresos(desde, hasta),
      egresoRepo.totalEgresos(desde, hasta),
      ventaRepo.ingresosPorPeriodo(desde, hasta),
      egresoRepo.egresosPorPeriodo(desde, hasta),
    ]);

  const fechaMap = new Map<
    string,
    { label: string; ingresos: number; egresos: number }
  >();

  for (const row of ingresosPorDia) {
    const key = row.fecha.slice(0, 10);
    if (!fechaMap.has(key)) {
      fechaMap.set(key, {
        label: format(new Date(key), 'dd/MM'),
        ingresos: 0,
        egresos: 0,
      });
    }
    fechaMap.get(key)!.ingresos += row.total;
  }

  for (const row of egresosPorDia) {
    const key = row.fecha.slice(0, 10);
    if (!fechaMap.has(key)) {
      fechaMap.set(key, {
        label: format(new Date(key), 'dd/MM'),
        ingresos: 0,
        egresos: 0,
      });
    }
    fechaMap.get(key)!.egresos += row.total;
  }

  const puntos = Array.from(fechaMap.values());

  return {
    ingresos: totalIngresos,
    egresos: totalEgresos,
    gananciaNeta: totalIngresos - totalEgresos,
    puntos,
  };
}
