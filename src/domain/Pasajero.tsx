import { LatLng } from 'react-native-maps';

export type Pasajero = {
  id: string,
  nombre: string,
  apellido: string,
  nacimiento: string,
  telefono: string,
  domicilio: string,
  pido_dpto: string,
  coordenadas: LatLng,
}