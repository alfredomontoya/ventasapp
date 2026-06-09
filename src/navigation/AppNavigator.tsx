import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ClientsScreen from '../screens/ClientsScreen';
import ClientDetailScreen from '../screens/ClientDetailScreen';
import ClientFormScreen from '../screens/ClientFormScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import SalesScreen from '../screens/SalesScreen';
import SaleFormScreen from '../screens/SaleFormScreen';
import SaleDetailScreen from '../screens/SaleDetailScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import ExpenseFormScreen from '../screens/ExpenseFormScreen';
import colors from '../theme/colors';

export type RootStackParamList = {
  Home: undefined;
  Clients: undefined;
  ClientDetail: { clienteId: number };
  ClientForm: { cliente?: any } | undefined;
  Products: undefined;
  ProductForm: { producto?: any } | undefined;
  Sales: undefined;
  SaleForm: undefined;
  SaleDetail: { ventaId: number };
  Expenses: undefined;
  ExpenseForm: { egreso?: any } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.white,
      headerTitleStyle: { fontWeight: '600' },
    }}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Inicio' }}
    />
    <Stack.Screen
      name="Clients"
      component={ClientsScreen}
      options={{ title: 'Clientes' }}
    />
    <Stack.Screen
      name="ClientDetail"
      component={ClientDetailScreen}
      options={{ title: 'Detalle Cliente' }}
    />
    <Stack.Screen
      name="ClientForm"
      component={ClientFormScreen}
      options={{ title: 'Cliente' }}
    />
    <Stack.Screen
      name="Products"
      component={ProductsScreen}
      options={{ title: 'Productos' }}
    />
    <Stack.Screen
      name="ProductForm"
      component={ProductFormScreen}
      options={{ title: 'Producto' }}
    />
    <Stack.Screen
      name="Sales"
      component={SalesScreen}
      options={{ title: 'Ventas' }}
    />
    <Stack.Screen
      name="SaleForm"
      component={SaleFormScreen}
      options={{ title: 'Nueva Venta' }}
    />
    <Stack.Screen
      name="SaleDetail"
      component={SaleDetailScreen}
      options={{ title: 'Detalle Venta' }}
    />
    <Stack.Screen
      name="Expenses"
      component={ExpensesScreen}
      options={{ title: 'Egresos' }}
    />
    <Stack.Screen
      name="ExpenseForm"
      component={ExpenseFormScreen}
      options={{ title: 'Egreso' }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
