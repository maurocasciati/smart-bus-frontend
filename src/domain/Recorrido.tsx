import { Escuela } from './Escuela';
import { Pasajero } from './Pasajero';

export type Recorrido = {
  id: string,
  nombre: string,
  esIda: boolean,
  horario: string,
  anio: string,
  pasajeros: Pasajero[],
  escuela: Escuela,
}