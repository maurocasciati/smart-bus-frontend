import { Escuela } from './Escuela';
import { Pasajero } from './Pasajero';

export type Recorrido = {
  id: number,
  nombre: string,
  esIda: boolean,
  horario: string,
  pasajeros: Pasajero[],
  escuela: Escuela,
}