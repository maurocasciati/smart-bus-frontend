import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { AuthContext } from '../auth/AuthProvider';
import RecorridoDetalle from '../screens/RecorridoDetalle';
import RecorridoDetalleTutor from '../screens/tutor/RecorridoDetalleTutor';
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
import { Pasajero } from '../domain/Pasajero';
import PasajeroEdicion from '../screens/PasajeroEdicion';
import EventualidadAusencia from '../screens/EventualidadAusencia';
import EventualidadDomicilio from '../screens/EventualidadDomicilio';
import VerEstadoDeCuenta from '../screens/VerEstadoDeCuenta';
import TutorListado from '../screens/TutorListado';
import { RolUsuario } from '../domain/RolUsuario';
import PasajeroDetalleTutor from '../screens/tutor/PasajeroDetalleTutor';
import RecorridoEnCursoTutor from '../screens/tutor/RecorridoEnCursoTutor';
import { PubNubEvent } from '../domain/PubNubEvent';

// Definicion de las pantallas de la aplicación, y los parametros que deben recibir
export type RootStackParamList = {
  Login: undefined;
  Inicio: undefined;
  RecorridoListado: undefined;
  RecorridoDetalle: { recorrido: Recorrido };
  RecorridoDetalleTutor: { recorrido: Recorrido };
  RecorridoEnCurso: { recorrido: Recorrido };
  RecorridoEnCursoTutor: { recorrido: Recorrido, eventoRecorrido: PubNubEvent };
  RecorridoEdicion: { recorrido: Recorrido | null };
  PasajeroDetalleTutor: { pasajero: Pasajero, recorrido: Recorrido | null };
  PasajeroEdicion: { dataRecorrido: RecorridoFormType | null, pasajero: Pasajero | null, recorrido: Recorrido | null };
  PasajeroListado: { recorrido: Recorrido };
  PasajeroSeleccion: { dataRecorrido: RecorridoFormType, recorrido: Recorrido | null };
  EscuelaEdicion: { dataRecorrido: RecorridoFormType | null, escuela: Escuela | null, recorrido: Recorrido | null };
  EscuelaSeleccion: { dataRecorrido: RecorridoFormType, recorrido: Recorrido | null };
  EventualidadAusencia: { recorrido: Recorrido, pasajero: Pasajero };
  EventualidadDomicilio: { recorrido: Recorrido, pasajero: Pasajero };
  EstadoDeCuenta: { recorrido: Recorrido, pasajero: Pasajero };
  TutorListado: { pasajero: Pasajero, recorrido: Recorrido };
};

// Definición del tipo de dato de las props de cada pantalla
export type InicioProps = NativeStackScreenProps<RootStackParamList, 'Inicio'>;
export type RecorridoListadoProps = NativeStackScreenProps<RootStackParamList, 'RecorridoListado'>;
export type RecorridoDetalleProps = NativeStackScreenProps<RootStackParamList, 'RecorridoDetalle'>;
export type RecorridoDetalleTutorProps = NativeStackScreenProps<RootStackParamList, 'RecorridoDetalleTutor'>;
export type RecorridoEnCursoProps = NativeStackScreenProps<RootStackParamList, 'RecorridoEnCurso'>;
export type RecorridoEnCursoTutorProps = NativeStackScreenProps<RootStackParamList, 'RecorridoEnCursoTutor'>;
export type RecorridoEdicionProps = NativeStackScreenProps<RootStackParamList, 'RecorridoEdicion'>;
export type PasajeroDetalleTutorProps = NativeStackScreenProps<RootStackParamList, 'PasajeroDetalleTutor'>;
export type PasajeroEdicionProps = NativeStackScreenProps<RootStackParamList, 'PasajeroEdicion'>;
export type PasajeroListadoProps = NativeStackScreenProps<RootStackParamList, 'PasajeroListado'>;
export type PasajeroSeleccionProps = NativeStackScreenProps<RootStackParamList, 'PasajeroSeleccion'>;
export type EscuelaEdicionProps = NativeStackScreenProps<RootStackParamList, 'EscuelaEdicion'>;
export type EscuelaSeleccionProps = NativeStackScreenProps<RootStackParamList, 'EscuelaSeleccion'>;
export type EventualidadAusenciaProps = NativeStackScreenProps<RootStackParamList, 'EventualidadAusencia'>;
export type EventualidadDomicilioProps = NativeStackScreenProps<RootStackParamList, 'EventualidadDomicilio'>;
export type EstadoDeCuentaProps = NativeStackScreenProps<RootStackParamList, 'EstadoDeCuenta'>;
export type TutorListadoProps = NativeStackScreenProps<RootStackParamList, 'TutorListado'>;

// Declaración del stack de pantallas que se va a usar dentro del componente de navegación
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function NavigationComponent() {
  const { token, rol } = React.useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        { !token || !rol ? (
          <>
            <Stack.Screen name="Login" component={Login} options={{ title: 'Ingresar' }}/>
          </>
        ) : rol.valueOf() === RolUsuario.CHOFER ? (
          <>
            <Stack.Screen name="RecorridoListado" component={RecorridoListado} options={{ title: 'Listado de Recorridos' }}/>
            <Stack.Screen name="RecorridoDetalle" component={RecorridoDetalle} options={{ title: 'Recorrido' }}/>
            <Stack.Screen name="RecorridoEnCurso" component={RecorridoEnCurso} options={{ title: 'Recorrido en curso', headerBackVisible: false }}/>
            <Stack.Screen name="RecorridoEdicion" component={RecorridoEdicion} options={{ title: 'Recorrido' }}/>
            <Stack.Screen name="PasajeroEdicion" component={PasajeroEdicion} options={{ title: 'Pasajero' }}/>
            <Stack.Screen name="PasajeroListado" component={PasajeroListado} options={{ title: 'Listado de Pasajeros' }}/>
            <Stack.Screen name="PasajeroSeleccion" component={PasajeroSeleccion} options={{ title: 'Seleccionar Pasajeros' }}/>
            <Stack.Screen name="EscuelaEdicion" component={EscuelaEdicion} options={{ title: 'Escuela' }}/>
            <Stack.Screen name="EscuelaSeleccion" component={EscuelaSeleccion} options={{ title: 'Seleccionar Escuela' }}/>
            <Stack.Screen name="EventualidadAusencia" component={EventualidadAusencia} options={{ title: 'Establecer ausencia' }}/>
            <Stack.Screen name="EventualidadDomicilio" component={EventualidadDomicilio} options={{ title: 'Cambio de domicilio temporal' }}/>
            <Stack.Screen name="EstadoDeCuenta" component={VerEstadoDeCuenta} options={{ title: 'Estado de cuenta' }}/>
            <Stack.Screen name="TutorListado" component={TutorListado} options={{ title: 'Listado de tutores' }}/>
          </>
        ) : rol.valueOf() == RolUsuario.TUTOR ? (
          <>
            <Stack.Screen name="RecorridoListado" component={RecorridoListado} options={{ title: 'Listado de Recorridos' }}/>
            <Stack.Screen name="RecorridoDetalleTutor" component={RecorridoDetalleTutor} options={{ title: 'Recorrido' }}/>
            <Stack.Screen name="RecorridoEnCursoTutor" component={RecorridoEnCursoTutor} options={{ title: 'Recorrido en curso' }}/>
            <Stack.Screen name="PasajeroDetalleTutor" component={PasajeroDetalleTutor} options={{ title: 'Detalles del pasajero' }}/>
            <Stack.Screen name="EventualidadAusencia" component={EventualidadAusencia} options={{ title: 'Establecer ausencia' }}/>
            <Stack.Screen name="EventualidadDomicilio" component={EventualidadDomicilio} options={{ title: 'Cambio de domicilio temporal' }}/>
            <Stack.Screen name="EstadoDeCuenta" component={VerEstadoDeCuenta} options={{ title: 'Estado de cuenta' }}/>
          </>
        ) : rol.valueOf() == RolUsuario.ESCUELA ? (
          <>
            <Stack.Screen name="RecorridoListado" component={RecorridoListado} options={{ title: 'Listado de Recorridos' }}/>
          </>
        ) : <></>}
      </Stack.Navigator>
      <StatusBar style='auto' />
    </NavigationContainer>
  );
}
