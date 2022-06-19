import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { AuthContext } from '../auth/AuthProvider';
import RecorridoDetalle from '../screens/RecorridoDetalle';
import HomeScreen from '../screens/Home';
import NotFound from '../screens/NotFound';
import RecorridoListado from '../screens/RecorridoListado';
import Login from '../screens/Login';
import { Recorrido } from '../domain/Recorrido';
import RecorridoEnCurso from '../screens/RecorridoEnCurso';
import PasajeroListado from '../screens/PasajeroListado';
import RecorridoEdicion from '../screens/RecorridoEdicion';
import { RecorridoFormType } from './form/FormTypes';
import EscuelaSeleccion from '../screens/EscuelaSeleccion';
import PasajeroSeleccion from '../screens/PasajeroSeleccion';
import { Escuela } from '../domain/Escuela';
import EscuelaEdicion from '../screens/EscuelaEdicion';

// Definicion de las pantallas de la aplicación, y los parametros que deben recibir
export type RootStackParamList = {
  NotFound: undefined;
  Login: undefined;
  Inicio: undefined;
  RecorridoListado: undefined;
  RecorridoDetalle: { recorrido: Recorrido };
  RecorridoEnCurso: { recorrido: Recorrido };
  RecorridoEdicion: { recorrido: Recorrido | null };
  PasajeroListado: { recorrido: Recorrido };
  PasajeroSeleccion: { dataRecorrido: RecorridoFormType };
  EscuelaEdicion: { dataRecorrido: RecorridoFormType | null, escuela: Escuela | null, recorrido: Recorrido | null };
  EscuelaSeleccion: { dataRecorrido: RecorridoFormType };
};

// Definición del tipo de dato de las props de cada pantalla
export type InicioProps = NativeStackScreenProps<RootStackParamList, 'Inicio'>;
export type RecorridoListadoProps = NativeStackScreenProps<RootStackParamList, 'RecorridoListado'>;
export type RecorridoDetalleProps = NativeStackScreenProps<RootStackParamList, 'RecorridoDetalle'>;
export type RecorridoEnCursoProps = NativeStackScreenProps<RootStackParamList, 'RecorridoEnCurso'>;
export type RecorridoEdicionProps = NativeStackScreenProps<RootStackParamList, 'RecorridoEdicion'>;
export type PasajeroListadoProps = NativeStackScreenProps<RootStackParamList, 'PasajeroListado'>;
export type PasajeroSeleccionProps = NativeStackScreenProps<RootStackParamList, 'PasajeroSeleccion'>;
export type EscuelaEdicionProps = NativeStackScreenProps<RootStackParamList, 'EscuelaEdicion'>;
export type EscuelaSeleccionProps = NativeStackScreenProps<RootStackParamList, 'EscuelaSeleccion'>;

// Declaración del stack de pantallas que se va a usar dentro del componente de navegación
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function NavigationComponent() {
  const { token } = React.useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        { token ? (
          <>
            <Stack.Screen name="Inicio" component={HomeScreen} />
            <Stack.Screen name="RecorridoListado" component={RecorridoListado} options={{ title: 'Listado de Recorridos' }}/>
            <Stack.Screen name="RecorridoDetalle" component={RecorridoDetalle} options={{ title: 'Detalle del Recorrido' }}/>
            <Stack.Screen name="RecorridoEnCurso" component={RecorridoEnCurso} options={{ title: 'Recorrido en Curso' }}/>
            <Stack.Screen name="RecorridoEdicion" component={RecorridoEdicion} options={{ title: 'Guardar Recorrido' }}/>
            <Stack.Screen name="PasajeroListado" component={PasajeroListado} options={{ title: 'Listado de Pasajeros' }}/>
            <Stack.Screen name="PasajeroSeleccion" component={PasajeroSeleccion} options={{ title: 'Seleccionar Pasajeros' }}/>
            <Stack.Screen name="EscuelaEdicion" component={EscuelaEdicion} options={{ title: 'Guardar Escuela' }}/>
            <Stack.Screen name="EscuelaSeleccion" component={EscuelaSeleccion} options={{ title: 'Seleccionar Escuela' }}/>
            <Stack.Screen name="NotFound" component={NotFound} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ title: 'Ingresar' }}/>
          </>
        )}
      </Stack.Navigator>
      <StatusBar style='auto' />
    </NavigationContainer>
  );
}
