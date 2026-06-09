import { getDatabase } from '../database/sqlite/init';
import { faker } from '@faker-js/faker';

export async function seedDatabase(): Promise<void> {
  const db = await getDatabase();

  const [count] = await db.executeSql('SELECT COUNT(*) as count FROM clientes');
  if (count.rows.item(0).count > 0) return;

  for (let i = 0; i < 10; i++) {
    await db.executeSql(
      'INSERT INTO clientes (nombre, telefono, email, direccion, createdAt) VALUES (?, ?, ?, ?, ?)',
      [
        faker.person.fullName(),
        faker.phone.number(),
        faker.internet.email(),
        faker.location.streetAddress(),
        faker.date.past({ years: 1 }).toISOString(),
      ],
    );
  }

  const productos = [
    { nombre: 'Laptop HP', precio: 4500000, stock: 5 },
    { nombre: 'Teclado mecánico', precio: 350000, stock: 15 },
    { nombre: 'Mouse inalámbrico', precio: 150000, stock: 20 },
    { nombre: 'Monitor 24"', precio: 1200000, stock: 8 },
    { nombre: 'Audífonos Bluetooth', precio: 250000, stock: 12 },
    { nombre: 'Cargador USB-C', precio: 80000, stock: 30 },
    { nombre: 'Hub USB 4 puertos', precio: 120000, stock: 10 },
    { nombre: 'Webcam HD', precio: 300000, stock: 6 },
    { nombre: 'SSD 1TB', precio: 600000, stock: 7 },
    { nombre: 'Memoria RAM 16GB', precio: 400000, stock: 9 },
  ];

  for (const p of productos) {
    await db.executeSql(
      'INSERT INTO productos (nombre, precio, stock, descripcion) VALUES (?, ?, ?, ?)',
      [p.nombre, p.precio, p.stock, null],
    );
  }

  const egresos = [
    { categoria: 'servicios', monto: 250000, descripcion: 'Factura de luz', fecha: '2026-05-05' },
    { categoria: 'servicios', monto: 180000, descripcion: 'Internet', fecha: '2026-05-06' },
    { categoria: 'alquiler', monto: 1500000, descripcion: 'Alquiler local', fecha: '2026-05-01' },
    { categoria: 'insumos', monto: 500000, descripcion: 'Compra de cajas y bolsas', fecha: '2026-05-10' },
    { categoria: 'insumos', monto: 800000, descripcion: 'Reposición de stock', fecha: '2026-05-15' },
    { categoria: 'otros', monto: 100000, descripcion: 'Limpieza', fecha: '2026-05-08' },
  ];

  for (const e of egresos) {
    await db.executeSql(
      'INSERT INTO egresos (categoria, monto, descripcion, fecha) VALUES (?, ?, ?, ?)',
      [e.categoria, e.monto, e.descripcion, e.fecha],
    );
  }
}
