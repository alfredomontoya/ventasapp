import dbConfig from '../config/db';
import { IClienteRepo } from './contracts/IClienteRepo';
import { IProductoRepo } from './contracts/IProductoRepo';
import { IVentaRepo } from './contracts/IVentaRepo';
import { IEgresoRepo } from './contracts/IEgresoRepo';

import { ClienteRepoSqlite } from './sqlite/clienteRepo';
import { ProductoRepoSqlite } from './sqlite/productoRepo';
import { VentaRepoSqlite } from './sqlite/ventaRepo';
import { EgresoRepoSqlite } from './sqlite/egresoRepo';

function getRepos(): {
  clienteRepo: IClienteRepo;
  productoRepo: IProductoRepo;
  ventaRepo: IVentaRepo;
  egresoRepo: IEgresoRepo;
} {
  switch (dbConfig.dbType) {
    case 'sqlite':
    default:
      return {
        clienteRepo: new ClienteRepoSqlite(),
        productoRepo: new ProductoRepoSqlite(),
        ventaRepo: new VentaRepoSqlite(),
        egresoRepo: new EgresoRepoSqlite(),
      };
  }
}

export const { clienteRepo, productoRepo, ventaRepo, egresoRepo } = getRepos();
