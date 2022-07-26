import { Parada } from './Parada';
import { Recorrido } from './Recorrido';

export type HistorialRecorrido = {
  id: number,
  recorrido: Recorrido,
  fechaInicio: Date,
  fechaFinalizacion: Date,
  paradas: Parada[]
}