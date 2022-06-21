import { LatLng } from 'react-native-maps';

export type Parada = {
  id: number,
  nombre: string,
  domicilio: string,
  coordenadas: LatLng,
  esEscuela: boolean,
}