import { IVentaRepo } from '../contracts/IVentaRepo';
import { Venta, DetalleVenta } from '../types';
import { getDatabase } from './init';

export class VentaRepoSqlite implements IVentaRepo {
  async listar(): Promise<Venta[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM ventas ORDER BY fecha DESC',
    );
    const ventas: Venta[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      ventas.push(results.rows.item(i) as Venta);
    }
    return ventas;
  }

  async obtenerPorId(id: number): Promise<(Venta & { items: DetalleVenta[] }) | null> {
    const db = await getDatabase();
    const [ventaResults] = await db.executeSql(
      'SELECT * FROM ventas WHERE id = ?',
      [id],
    );
    if (ventaResults.rows.length === 0) return null;
    const venta = ventaResults.rows.item(0) as Venta;

    const [itemsResults] = await db.executeSql(
      'SELECT * FROM detalle_ventas WHERE ventaId = ?',
      [id],
    );
    const items: DetalleVenta[] = [];
    for (let i = 0; i < itemsResults.rows.length; i++) {
      items.push(itemsResults.rows.item(i) as DetalleVenta);
    }

    return { ...venta, items };
  }

  async listarPorCliente(clienteId: number): Promise<Venta[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM ventas WHERE clienteId = ? ORDER BY fecha DESC',
      [clienteId],
    );
    const ventas: Venta[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      ventas.push(results.rows.item(i) as Venta);
    }
    return ventas;
  }

  async crear(
    data: Omit<Venta, 'id'>,
    items: Omit<DetalleVenta, 'id' | 'ventaId'>[],
  ): Promise<Venta> {
    const db = await getDatabase();
    const [ventaResult] = await db.executeSql(
      'INSERT INTO ventas (clienteId, total, fecha) VALUES (?, ?, ?)',
      [data.clienteId, data.total, data.fecha],
    );
    const ventaId = ventaResult.insertId;

    for (const item of items) {
      await db.executeSql(
        'INSERT INTO detalle_ventas (ventaId, productoId, cantidad, precioUnitario) VALUES (?, ?, ?, ?)',
        [ventaId, item.productoId, item.cantidad, item.precioUnitario],
      );
      await db.executeSql(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.productoId],
      );
    }

    return { id: ventaId, ...data } as Venta;
  }

  async eliminar(id: number): Promise<void> {
    const db = await getDatabase();

    const [items] = await db.executeSql(
      'SELECT * FROM detalle_ventas WHERE ventaId = ?',
      [id],
    );
    for (let i = 0; i < items.rows.length; i++) {
      const item = items.rows.item(i);
      await db.executeSql(
        'UPDATE productos SET stock = stock + ? WHERE id = ?',
        [item.cantidad, item.productoId],
      );
    }

    await db.executeSql('DELETE FROM ventas WHERE id = ?', [id]);
  }

  async totalIngresos(desde: string, hasta: string): Promise<number> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      'SELECT COALESCE(SUM(total), 0) as total FROM ventas WHERE fecha >= ? AND fecha <= ?',
      [desde, hasta],
    );
    return results.rows.item(0).total;
  }

  async ingresosPorPeriodo(desde: string, hasta: string): Promise<{ fecha: string; total: number }[]> {
    const db = await getDatabase();
    const [results] = await db.executeSql(
      `SELECT DATE(fecha) as fecha, SUM(total) as total 
       FROM ventas 
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
