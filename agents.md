# VentasCRM — AGENTS.md

## Stack
- **Framework:** React Native 0.86.0
- **Language:** TypeScript 5.9+
- **Runtime:** Node >= 22.11.0
- **Package manager:** yarn (lock: yarn.lock)
- **Database:** SQLite via `react-native-sqlite-storage` (con soporte para migrar a Firebase o MongoDB vía patrón Repositorio)
- **Navigation:** React Navigation 7 (native-stack)
- **Gráficos:** `react-native-chart-kit` + `react-native-svg`

## Scripts
| Comando | Descripción |
|---|---|
| `yarn start` | Inicia Metro bundler |
| `yarn android` | Build + run en Android |
| `yarn ios` | Build + run en iOS |
| `yarn test` | Ejecuta Jest |
| `yarn lint` | ESLint sobre todo el proyecto |

## Estructura del proyecto
```
VentasCRM/
├── App.tsx                      # Componente raíz (SafeAreaProvider + Navigator)
├── index.js                     # Entry point (AppRegistry)
├── app.json                     # Nombre y displayName de la app
├── android/                     # Proyecto nativo Android (Gradle)
├── ios/                         # Proyecto nativo iOS (Xcode + CocoaPods)
├── __tests__/                   # Tests con Jest
├── src/
│   ├── assets/
│   │   └── logo.png             # Logo de la app
│   ├── components/
│   │   ├── ClientCard.tsx       # Card de cliente en lista
│   │   ├── ProductCard.tsx      # Card de producto con stock
│   │   ├── ExpenseCard.tsx      # Card de egreso
│   │   ├── SaleItem.tsx         # Item de venta en historial
│   │   ├── DashboardCard.tsx    # Card de resumen (totales)
│   │   ├── FiltroChips.tsx      # Chips de filtro: Hoy / Semana / Mes / Rango
│   │   └── GraficoIngresosEgresos.tsx  # Gráfico de barras agrupadas
│   ├── config/
│   │   └── db.ts                # Config: dbType = 'sqlite' | 'firebase' | 'mongodb'
│   ├── database/
│   │   ├── types.ts             # Interfaces de dominio (Cliente, Producto, Venta, Egreso)
│   │   ├── contracts/
│   │   │   ├── IClienteRepo.ts  # Contrato abstracto para Cliente
│   │   │   ├── IProductoRepo.ts # Contrato abstracto para Producto
│   │   │   ├── IVentaRepo.ts    # Contrato abstracto para Venta
│   │   │   └── IEgresoRepo.ts   # Contrato abstracto para Egreso
│   │   ├── sqlite/
│   │   │   ├── init.ts          # CREATE TABLE + seed
│   │   │   ├── clienteRepo.ts   # CRUD Clientes SQLite
│   │   │   ├── productoRepo.ts  # CRUD Productos SQLite
│   │   │   ├── ventaRepo.ts     # CRUD Ventas + Detalle SQLite
│   │   │   └── egresoRepo.ts    # CRUD Egresos SQLite
│   │   └── index.ts             # Exporta el repo activo según config/db.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx     # Stack navigator (11 pantallas)
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Dashboard con gráfico + filtros + resumen
│   │   ├── ClientsScreen.tsx    # Lista de clientes + búsqueda + FAB
│   │   ├── ClientDetailScreen.tsx # Detalle cliente + historial ventas
│   │   ├── ClientFormScreen.tsx # Crear/editar cliente
│   │   ├── ProductsScreen.tsx   # Lista de productos + búsqueda + stock
│   │   ├── ProductFormScreen.tsx # Crear/editar producto
│   │   ├── SalesScreen.tsx      # Historial de ventas
│   │   ├── SaleFormScreen.tsx   # Registrar venta (cliente + productos)
│   │   ├── SaleDetailScreen.tsx # Detalle completo de venta
│   │   ├── ExpensesScreen.tsx   # Lista de egresos con filtros
│   │   └── ExpenseFormScreen.tsx # Registrar egreso
│   ├── theme/
│   │   └── colors.ts            # Paleta corporativa
│   └── utils/
│       ├── format.ts            # Formateo de moneda, fechas
│       ├── reportes.ts          # Consultas agregadas (ingresos vs egresos)
│       └── seed.ts              # Datos semilla para desarrollo
├── .eslintrc.js
├── .prettierrc.js
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── jest.config.js
└── Gemfile
```

## Dependencias principales
- `@react-navigation/native` + `@react-navigation/native-stack` — Navegación
- `react-native-sqlite-storage` — Base de datos SQLite local
- `react-native-chart-kit` + `react-native-svg` — Gráficos
- `date-fns` — Manipulación de fechas
- `@react-native-community/datetimepicker` — DatePicker nativo
- `@faker-js/faker` — Generación de datos semilla (dev)

## Convenciones de código
- **Estilo:** Prettier con `singleQuote`, `arrowParens: "avoid"`, `trailingComma: "all"`
- **Testing:** Jest con `react-test-renderer`. Tests en `__tests__/` con sufijo `.test.tsx`
- **Linting:** ESLint con extensión `@react-native`
- **TypeScript:** Strict mode via `@react-native/typescript-config`
- **Nombrado:** PascalCase para componentes, camelCase para funciones/variables
- **Imports:** Sin comentarios de sección; imports agrupados por librería externa → interna

## Patrones del proyecto
- **Arquitectura:** Patrón Repositorio con interfaces (database/contracts/) para abstraer la base de datos. Las pantallas nunca importan SQLite directamente.
- **Database switching:** Para migrar a Firebase/MongoDB, crear nueva implementación en `database/firebase/` o `database/mongodb/` implementando los contracts, y cambiar `config/db.ts`.
- Componente raíz `App` en `App.tsx`, registrado vía `AppRegistry.registerComponent`
- `SafeAreaProvider` de `react-native-safe-area-context` en la raíz
- `NavigationContainer` + `createNativeStackNavigator` para navegación
- `StyleSheet.create` para estilos (no librerías CSS-in-JS externas)
- Componentes funcionales con hooks (no clases)
- Paleta de colores: verde esmeralda (#0D9488) como primario, rojo para egresos (#E53E3E)

## Pantallas
| Pantalla | Ruta | Descripción |
|---|---|---|
| Home | `Home` | Dashboard con gráfico ingresos vs egresos (barras agrupadas), filtros día/semana/mes/rango, resumen de ganancia neta |
| Clients | `Clients` | Lista de clientes con búsqueda + FAB para agregar |
| ClientDetail | `ClientDetail` | Datos del cliente + historial de ventas del cliente |
| ClientForm | `ClientForm` | Formulario crear/editar cliente |
| Products | `Products` | Lista de productos con stock + búsqueda |
| ProductForm | `ProductForm` | Formulario crear/editar producto |
| Sales | `Sales` | Historial de ventas con filtros |
| SaleForm | `SaleForm` | Registrar venta: seleccionar cliente + agregar productos + total |
| SaleDetail | `SaleDetail` | Detalle completo de la venta (productos, total, fecha) |
| Expenses | `Expenses` | Lista de egresos con filtro por categoría y fecha |
| ExpenseForm | `ExpenseForm` | Registrar egreso (categoría, monto, descripción, fecha) |

## Entidades
### Cliente
| Campo | Tipo |
|---|---|
| id | number |
| nombre | string |
| telefono | string? |
| email | string? |
| direccion | string? |
| createdAt | string |

### Producto
| Campo | Tipo |
|---|---|
| id | number |
| nombre | string |
| precio | number |
| stock | number |
| descripcion | string? |

### Venta
| Campo | Tipo |
|---|---|
| id | number |
| clienteId | number |
| total | number |
| fecha | string |

### DetalleVenta
| Campo | Tipo |
|---|---|
| id | number |
| ventaId | number |
| productoId | number |
| cantidad | number |
| precioUnitario | number |

### Egreso
| Campo | Tipo |
|---|---|
| id | number |
| categoria | 'servicios' \| 'alquiler' \| 'insumos' \| 'otros' |
| monto | number |
| descripcion | string? |
| fecha | string |

## Splash screen
- Android: tema `SplashTheme` con fondo verde esmeralda
- Se muestra al abrir la app y transiciona al contenido al cargar JS
- Configurado en `android/app/src/main/res/values/styles.xml` y `MainActivity.kt`

## Testing
```bash
yarn test                # Ejecuta tests
yarn test --watch        # Modo watch
```

## CI / Lint / TypeCheck
```bash
yarn lint
npx tsc --noEmit         # Type check (no hay script dedicado, ejecutar así)
```
