import { IClienteRepo } from '../contracts/IClienteRepo';
import { Cliente } from '../types';
import { getDatabase } from './init';

export class ClienteRepoSqlite implements IClienteRepo {
  async listar(): Promise<Cliente[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM clientes ORDER BY createdAt DESC',
    );
    const clientes: Cliente[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      clientes.push(results.rows.item(i) as Cliente);
    }
    return clientes;
  }

  async obtenerPorId(id: number): Promise<Cliente | null> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM clientes WHERE id = ?',
      [id],
    );
    if (results.rows.length === 0) return null;
    return results.rows.item(0) as Cliente;
  }

  async buscar(query: string): Promise<Cliente[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      "SELECT * FROM clientes WHERE nombre LIKE ? OR telefono LIKE ? OR email LIKE ? ORDER BY createdAt DESC",
      [`%${query}%`, `%${query}%`, `%${query}%`],
    );
    const clientes: Cliente[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      clientes.push(results.rows.item(i) as Cliente);
    }
    return clientes;
  }

  async crear(data: Omit<Cliente, 'id'>): Promise<Cliente> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'INSERT INTO clientes (nombre, telefono, email, direccion, createdAt) VALUES (?, ?, ?, ?, ?)',
      [data.nombre, data.telefono ?? null, data.email ?? null, data.direccion ?? null, data.createdAt],
    );
    return { id: results.insertId, ...data } as Cliente;
  }

  async actualizar(id: number, data: Partial<Cliente>): Promise<Cliente> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    if (data.nombre !== undefined) { fields.push('nombre = ?'); values.push(data.nombre); }
    if (data.telefono !== undefined) { fields.push('telefono = ?'); values.push(data.telefono); }
    if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }
    if (data.direccion !== undefined) { fields.push('direccion = ?'); values.push(data.direccion); }
    values.push(id);
    await db.executeSql(
      `UPDATE clientes SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );
    return (await this.obtenerPorId(id))!;
  }

  async eliminar(id: number): Promise<void> {
    const db = await getDatabase();
    await db.executeSql('DELETE FROM clientes WHERE id = ?', [id]);
  }

  async contar(): Promise<number> {
    const db = await getDatabase();
    const [results] = await db.executeSql('SELECT COUNT(*) as count FROM clientes');
    return results.rows.item(0).count;
  }
}
