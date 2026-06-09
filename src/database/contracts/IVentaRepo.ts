import { Venta, DetalleVenta } from '../types';

export interface IVentaRepo {
  listar(): Promise<Venta[]>;
  obtenerPorId(id: number): Promise<(Venta & { items: DetalleVenta[] }) | null>;
  listarPorCliente(clienteId: number): Promise<Venta[]>;
  crear(
    data: Omit<Venta, 'id'>,
    items: Omit<DetalleVenta, 'id' | 'ventaId'>[],
  ): Promise<Venta>;
  eliminar(id: number): Promise<void>;
  totalIngresos(desde: string, hasta: string): Promise<number>;
  ingresosPorPeriodo(desde: string, hasta: string): Promise<{ fecha: string; total: number }[]>;
}
