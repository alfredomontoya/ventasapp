import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import type { RootStackParamList } from '../navigation/AppNavigator';
import colors from '../theme/colors';

type MenuItem = {
  label: string;
  icon: string;
  screen: keyof RootStackParamList;
};

const menuItems: MenuItem[] = [
  { label: 'Inicio', icon: '🏠', screen: 'Home' },
  { label: 'Clientes', icon: '👥', screen: 'Clients' },
  { label: 'Productos', icon: '📦', screen: 'Products' },
  { label: 'Ventas', icon: '🛒', screen: 'Sales' },
  { label: 'Egresos', icon: '💸', screen: 'Expenses' },
  { label: 'Configuración', icon: '⚙️', screen: 'Settings' },
  { label: 'Perfil', icon: '👤', screen: 'Profile' },
];

const DrawerContent = ({
  navigation,
  state,
}: DrawerContentComponentProps) => {
  const drawerRoute = state.routes[state.index];
  const stackState = drawerRoute?.state;
  const currentRoute =
    (stackState?.routes?.[stackState.index ?? 0]?.name as keyof RootStackParamList) ?? 'Home';

  const navigateTo = (screen: keyof RootStackParamList) => {
    navigation.navigate('MainStack', { screen });
    navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>VentasCRM</Text>
        <Text style={styles.subtitle}>Sistema de Gestión</Text>
      </View>
      <DrawerContentScrollView>
        {menuItems.map(item => {
          const isActive = currentRoute === item.screen;
          return (
            <TouchableOpacity
              key={item.screen}
              style={[styles.menuItem, isActive && styles.activeItem]}
              onPress={() => navigateTo(item.screen)}
              activeOpacity={0.7}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text
                style={[styles.menuLabel, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 2,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  activeItem: {
    backgroundColor: colors.primary + '15',
  },
  icon: {
    fontSize: 20,
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default DrawerContent;
