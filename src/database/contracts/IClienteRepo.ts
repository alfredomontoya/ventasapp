import { Cliente } from '../types';

export interface IClienteRepo {
  listar(): Promise<Cliente[]>;
  obtenerPorId(id: number): Promise<Cliente | null>;
  buscar(query: string): Promise<Cliente[]>;
  crear(data: Omit<Cliente, 'id'>): Promise<Cliente>;
  actualizar(id: number, data: Partial<Cliente>): Promise<Cliente>;
  eliminar(id: number): Promise<void>;
  contar(): Promise<number>;
}
