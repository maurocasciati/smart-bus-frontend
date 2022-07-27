import { IrregularidadHistorialRecorrido } from './IrregularidadHistorialRecorrido';
import { ParadaHistorialRecorrido } from './ParadaHistorialRecorrido';
import { Recorrido } from './Recorrido';

export type HistorialRecorrido = {
  id: number,
  recorrido: Recorrido,
  fechaInicio: Date,
  fechaFinalizacion: Date,
  fechaParadaEscuela?: Date,
  interrumpido: boolean,
  irregularidades: IrregularidadHistorialRecorrido[],
  paradas: ParadaHistorialRecorrido[]
}