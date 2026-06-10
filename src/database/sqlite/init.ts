import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      db = await SQLite.openDatabase({
        name: 'ventascrm.db',
        location: 'default',
      });

    await db.executeSql('PRAGMA foreign_keys = ON');

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT,
        email TEXT,
        direccion TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        descripcion TEXT
      )
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clienteId INTEGER NOT NULL,
        total REAL NOT NULL,
        fecha TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (clienteId) REFERENCES clientes(id) ON DELETE CASCADE
      )
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS detalle_ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ventaId INTEGER NOT NULL,
        productoId INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        precioUnitario REAL NOT NULL,
        FOREIGN KEY (ventaId) REFERENCES ventas(id) ON DELETE CASCADE,
        FOREIGN KEY (productoId) REFERENCES productos(id) ON DELETE CASCADE
      )
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS egresos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria TEXT NOT NULL CHECK(categoria IN ('servicios','alquiler','insumos','otros')),
        monto REAL NOT NULL,
        descripcion TEXT,
        fecha TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    return db;
    } catch (e) {
      initPromise = null;
      throw e;
    }
  })();

  return initPromise;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
