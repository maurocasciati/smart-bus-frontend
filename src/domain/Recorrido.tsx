import { Escuela } from './Escuela';
import { Pasajero } from './Pasajero';

export type Recorrido = {
  id: number,
  nombre: string,
  esRecorridoDeIda: boolean,
  horario: Date,
  pasajeros: Pasajero[],
  escuela: Escuela | null,
}