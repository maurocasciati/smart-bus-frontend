import { Domicilio } from './Domicilio';

export type Pasajero = {
  id: number,
  nombre: string,
  apellido: string,
  fechaNacimiento: string,
  telefono: string,
  domicilio: Domicilio,
  pisoDepartamento: string,
}