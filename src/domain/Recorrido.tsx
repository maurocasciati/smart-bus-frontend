import { Chofer } from './Chofer';
import { Escuela } from './Escuela';
import { Pasajero } from './Pasajero';

export type Recorrido = {
  id: number,
  nombre: string,
  esRecorridoDeIda: boolean,
  horario: Date,
  chofer: Chofer,
  pasajeros: Pasajero[],
  escuela: Escuela | null,
}