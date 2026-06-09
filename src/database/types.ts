export interface Cliente {
  id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  createdAt: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
}

export interface Venta {
  id: number;
  clienteId: number;
  total: number;
  fecha: string;
}

export interface DetalleVenta {
  id: number;
  ventaId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export type CategoriaEgreso = 'servicios' | 'alquiler' | 'insumos' | 'otros';

export interface Egreso {
  id: number;
  categoria: CategoriaEgreso;
  monto: number;
  descripcion?: string;
  fecha: string;
}
