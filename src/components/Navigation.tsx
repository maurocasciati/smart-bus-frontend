import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { AuthContext } from '../auth/AuthProvider';
import DetalleRecorrido from '../screens/DetalleRecorrido';
import HomeScreen from '../screens/Home';
import ListadoRecorridos from '../screens/ListadoRecorridos';
import Login from '../screens/Login';

// Definicion de las pantallas de la aplicación, y los parametros que deben recibir
export type RootStackParamList = {
  Login: undefined;
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
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    console.log({token});
  }, [token]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        { token ? (
          <>
            <Stack.Screen name="Inicio" component={HomeScreen} />
            <Stack.Screen name="ListadoRecorridos" component={ListadoRecorridos} />
            <Stack.Screen name="DetalleRecorrido" component={DetalleRecorrido} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
          </>
        )}
      </Stack.Navigator>
      <StatusBar style='auto' />
    </NavigationContainer>
  );
}
