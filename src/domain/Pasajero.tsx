import { Parada } from './Parada';

export type Pasajero = Parada & {
  apellido: string,
  nacimiento: string,
  piso_dpto: string,
  esEscuela: false,
  telefono: string,
}