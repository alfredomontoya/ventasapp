import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
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
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DrawerContent from '../components/DrawerContent';
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
  Profile: undefined;
  Settings: undefined;
};

type DrawerParamList = {
  MainStack: NavigatorScreenParams<RootStackParamList> | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const HamburgerButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.hamburger}>
    <Text style={styles.hamburgerText}>☰</Text>
  </TouchableOpacity>
);

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '600' },
        headerLeft: () => (
          <HamburgerButton
            onPress={() =>
              (navigation.getParent() as DrawerNavigationProp<DrawerParamList>)?.openDrawer()
            }
          />
        ),
      })}>
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
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />
    </Stack.Navigator>
  );
}

const AppNavigator: React.FC = () => (
  <Drawer.Navigator
    drawerContent={DrawerContent}
    screenOptions={{
      headerShown: false,
      drawerType: 'front',
    }}>
    <Drawer.Screen name="MainStack" component={MainStack} />
  </Drawer.Navigator>
);

const styles = StyleSheet.create({
  hamburger: {
    marginLeft: 4,
    padding: 8,
  },
  hamburgerText: {
    fontSize: 22,
    color: colors.white,
  },
});

export default AppNavigator;
