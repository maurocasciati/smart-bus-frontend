import { Domicilio } from './Domicilio';
import { Tutor } from './Tutor';

export type Escuela = {
  id: number,  
  nombre: string,
  direccion: Domicilio,
  usuarios: Tutor[],
}