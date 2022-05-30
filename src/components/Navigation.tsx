import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import DetalleRecorrido from '../screens/DetalleRecorrido';
import HomeScreen from '../screens/Home';
import ListadoRecorridos from '../screens/ListadoRecorridos';

// Definicion de las pantallas de la aplicación, y los parametros que deben recibir
export type RootStackParamList = {
  Inicio: undefined;
  ListadoRecorridos: undefined;
  DetalleRecorrido: { recorridoId: number };
};

// Definición del tipo de dato de las props de cada pantalla
export type InicioProps = NativeStackScreenProps<RootStackParamList, 'Inicio'>;
export type ListadoRecorridosProps = NativeStackScreenProps<RootStackParamList, 'ListadoRecorridos'>;
export type DetalleRecorridoProps = NativeStackScreenProps<RootStackParamList, 'DetalleRecorrido'>;

// Declaración del stack de pantallas que se va a usar dentro del componente de navegación
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function NavigationComponent() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="ListadoRecorridos" component={ListadoRecorridos} />
        <Stack.Screen name="DetalleRecorrido" component={DetalleRecorrido} />
      </Stack.Navigator>
      <StatusBar style='auto' />
    </NavigationContainer>
  );
}
