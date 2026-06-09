import { IEgresoRepo } from '../contracts/IEgresoRepo';
import { Egreso, CategoriaEgreso } from '../types';
import { getDatabase } from './init';

export class EgresoRepoSqlite implements IEgresoRepo {
  async listar(): Promise<Egreso[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM egresos ORDER BY fecha DESC',
    );
    const egresos: Egreso[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      egresos.push(results.rows.item(i) as Egreso);
    }
    return egresos;
  }

  async obtenerPorId(id: number): Promise<Egreso | null> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM egresos WHERE id = ?',
      [id],
    );
    if (results.rows.length === 0) return null;
    return results.rows.item(0) as Egreso;
  }

  async listarPorCategoria(categoria: CategoriaEgreso): Promise<Egreso[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM egresos WHERE categoria = ? ORDER BY fecha DESC',
      [categoria],
    );
    const egresos: Egreso[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      egresos.push(results.rows.item(i) as Egreso);
    }
    return egresos;
  }

  async crear(data: Omit<Egreso, 'id'>): Promise<Egreso> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'INSERT INTO egresos (categoria, monto, descripcion, fecha) VALUES (?, ?, ?, ?)',
      [data.categoria, data.monto, data.descripcion ?? null, data.fecha],
    );
    return { id: results.insertId, ...data } as Egreso;
  }

  async actualizar(id: number, data: Partial<Egreso>): Promise<Egreso> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    if (data.categoria !== undefined) { fields.push('categoria = ?'); values.push(data.categoria); }
    if (data.monto !== undefined) { fields.push('monto = ?'); values.push(data.monto); }
    if (data.descripcion !== undefined) { fields.push('descripcion = ?'); values.push(data.descripcion); }
    if (data.fecha !== undefined) { fields.push('fecha = ?'); values.push(data.fecha); }
    values.push(id);
    await db.executeSql(
      `UPDATE egresos SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );
    return (await this.obtenerPorId(id))!;
  }

  async eliminar(id: number): Promise<void> {
    const db = await getDatabase();
    await db.executeSql('DELETE FROM egresos WHERE id = ?', [id]);
  }

  async totalEgresos(desde: string, hasta: string): Promise<number> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT COALESCE(SUM(monto), 0) as total FROM egresos WHERE fecha >= ? AND fecha <= ?',
      [desde, hasta],
    );
    return results.rows.item(0).total;
  }

  async egresosPorPeriodo(desde: string, hasta: string): Promise<{ fecha: string; total: number }[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      `SELECT DATE(fecha) as fecha, SUM(monto) as total 
       FROM egresos 
       WHERE fecha >= ? AND fecha <= ? 
       GROUP BY DATE(fecha) 
       ORDER BY fecha ASC`,
      [desde, hasta],
    );
    const rows: { fecha: string; total: number }[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      rows.push(results.rows.item(i));
    }
    return rows;
  }
}
