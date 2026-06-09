import { Producto } from '../types';

export interface IProductoRepo {
  listar(): Promise<Producto[]>;
  obtenerPorId(id: number): Promise<Producto | null>;
  buscar(query: string): Promise<Producto[]>;
  crear(data: Omit<Producto, 'id'>): Promise<Producto>;
  actualizar(id: number, data: Partial<Producto>): Promise<Producto>;
  eliminar(id: number): Promise<void>;
  contar(): Promise<number>;
  stockBajo(limite: number): Promise<Producto[]>;
}
