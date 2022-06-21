import { LatLng } from 'react-native-maps';
import { Escuela } from './Escuela';
import { Pasajero } from './Pasajero';

export type Parada = {
  id: number,
  nombre: string,
  domicilio: string,
  coordenadas: LatLng,
  esEscuela: boolean,
}

export const mapEscuelaToParada = (escuela: Escuela) => {
  return {
    id: escuela.id,
    nombre: escuela.nombre,
    domicilio: escuela.direccion.domicilio,
    coordenadas: escuela.direccion.coordenadas,
    esEscuela: true,
  } as Parada;
};

export const mapPasajerosToParada = (pasajeros: Pasajero[]) => {
  return pasajeros.map(pasajero => ({
    id: pasajero.id,
    nombre: pasajero.nombre,
    domicilio: pasajero.domicilio.domicilio,
    coordenadas: pasajero.domicilio.coordenadas,
    esEscuela: false,
  } as Parada));
};
