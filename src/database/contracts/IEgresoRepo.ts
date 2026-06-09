import { Egreso, CategoriaEgreso } from '../types';

export interface IEgresoRepo {
  listar(): Promise<Egreso[]>;
  obtenerPorId(id: number): Promise<Egreso | null>;
  listarPorCategoria(categoria: CategoriaEgreso): Promise<Egreso[]>;
  crear(data: Omit<Egreso, 'id'>): Promise<Egreso>;
  actualizar(id: number, data: Partial<Egreso>): Promise<Egreso>;
  eliminar(id: number): Promise<void>;
  totalEgresos(desde: string, hasta: string): Promise<number>;
  egresosPorPeriodo(desde: string, hasta: string): Promise<{ fecha: string; total: number }[]>;
}
