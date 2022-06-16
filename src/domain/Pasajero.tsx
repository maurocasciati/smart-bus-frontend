import { Parada } from './Parada';

export type Pasajero = Parada & {
  apellido: string,
  nacimiento: string,
  pido_dpto: string,
  esEscuelta: false,
}