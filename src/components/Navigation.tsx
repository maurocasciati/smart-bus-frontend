import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { AuthContext } from '../auth/AuthProvider';
import DetalleRecorrido from '../screens/RecorridoDetalle';
import HomeScreen from '../screens/Home';
import NotFound from '../screens/NotFound';
import ListadoRecorridos from '../screens/RecorridoListado';
import Login from '../screens/Login';
import { Recorrido } from '../domain/Recorrido';

// Definicion de las pantallas de la aplicación, y los parametros que deben recibir
export type RootStackParamList = {
  NotFound: undefined;
  Login: undefined;
  Inicio: undefined;
  ListadoRecorridos: undefined;
  DetalleRecorrido: { recorrido: Recorrido };
};

// Definición del tipo de dato de las props de cada pantalla
export type InicioProps = NativeStackScreenProps<RootStackParamList, 'Inicio'>;
export type ListadoRecorridosProps = NativeStackScreenProps<RootStackParamList, 'ListadoRecorridos'>;
export type DetalleRecorridoProps = NativeStackScreenProps<RootStackParamList, 'DetalleRecorrido'>;

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
            <Stack.Screen name="ListadoRecorridos" component={ListadoRecorridos} options={{ title: 'Listado de Recorridos' }}/>
            <Stack.Screen name="DetalleRecorrido" component={DetalleRecorrido} options={{ title: 'Detalle del Recorrido' }}/>
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
