import { LatLng } from 'react-native-maps';

export type Parada = {
  id: string,
  nombre: string,
  domicilio: string,
  coordenadas: LatLng,
  telefono: string,
  esEscuela: boolean,
}