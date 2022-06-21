import { Escuela } from './Escuela';
import { Pasajero } from './Pasajero';

export type Recorrido = {
  id: number,
  nombre: string,
  esRecorridoDeIda: boolean,
  horario: string,
  pasajeros: Pasajero[],
  escuela: Escuela,
}