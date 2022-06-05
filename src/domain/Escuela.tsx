import { LatLng } from 'react-native-maps';

export type Escuela = {
  id: string,
  nombre: string,
  telefono: string,
  domicilio: string,
  coordenadas: LatLng,
}