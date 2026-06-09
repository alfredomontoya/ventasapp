import { IProductoRepo } from '../contracts/IProductoRepo';
import { Producto } from '../types';
import { getDatabase } from './init';

export class ProductoRepoSqlite implements IProductoRepo {
  async listar(): Promise<Producto[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM productos ORDER BY nombre ASC',
    );
    const productos: Producto[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      productos.push(results.rows.item(i) as Producto);
    }
    return productos;
  }

  async obtenerPorId(id: number): Promise<Producto | null> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM productos WHERE id = ?',
      [id],
    );
    if (results.rows.length === 0) return null;
    return results.rows.item(0) as Producto;
  }

  async buscar(query: string): Promise<Producto[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM productos WHERE nombre LIKE ? OR descripcion LIKE ? ORDER BY nombre ASC',
      [`%${query}%`, `%${query}%`],
    );
    const productos: Producto[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      productos.push(results.rows.item(i) as Producto);
    }
    return productos;
  }

  async crear(data: Omit<Producto, 'id'>): Promise<Producto> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'INSERT INTO productos (nombre, precio, stock, descripcion) VALUES (?, ?, ?, ?)',
      [data.nombre, data.precio, data.stock, data.descripcion ?? null],
    );
    return { id: results.insertId, ...data } as Producto;
  }

  async actualizar(id: number, data: Partial<Producto>): Promise<Producto> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    if (data.nombre !== undefined) { fields.push('nombre = ?'); values.push(data.nombre); }
    if (data.precio !== undefined) { fields.push('precio = ?'); values.push(data.precio); }
    if (data.stock !== undefined) { fields.push('stock = ?'); values.push(data.stock); }
    if (data.descripcion !== undefined) { fields.push('descripcion = ?'); values.push(data.descripcion); }
    values.push(id);
    await db.executeSql(
      `UPDATE productos SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );
    return (await this.obtenerPorId(id))!;
  }

  async eliminar(id: number): Promise<void> {
    const db = await getDatabase();
    await db.executeSql('DELETE FROM productos WHERE id = ?', [id]);
  }

  async contar(): Promise<number> {
    const db = await getDatabase();
    const [results] = await db.executeSql('SELECT COUNT(*) as count FROM productos');
    return results.rows.item(0).count;
  }

  async stockBajo(limite: number): Promise<Producto[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM productos WHERE stock <= ? ORDER BY stock ASC',
      [limite],
    );
    const productos: Producto[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      productos.push(results.rows.item(i) as Producto);
    }
    return productos;
  }
}
