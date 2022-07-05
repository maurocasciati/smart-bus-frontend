import { Domicilio } from './Domicilio';
import { Tutor } from './Tutor';

export type Pasajero = {
  id: number,
  nombre: string,
  apellido: string,
  fechaNacimiento: Date,
  telefono: string,
  domicilio: Domicilio,
  pisoDepartamento: string,
  tutores: Tutor[],
}