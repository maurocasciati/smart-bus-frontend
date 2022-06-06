import { Escuela } from './domain/Escuela';
import { Pasajero } from './domain/Pasajero';
import { Recorrido } from './domain/Recorrido';

export const escuelaMock = {
  nombre: 'Escuela Técnica N° 9',
  domicilio: 'Gral. Martín de Gainza 1050',
  coordenadas: {
    latitude: -34.608751,
    longitude: -58.446538,
  }
} as Escuela;

export const pasajerosMock = [
    {
      id: '1',
      nombre: 'Mauro',
      apellido: 'Casciati',
      domicilio: 'Federico García Lorca 250',
      coordenadas: {
        latitude: -34.618654,
        longitude: -58.445307,
      }
    } as Pasajero,
    {
      id: '2',
      nombre: 'Nicolas',
      apellido: 'Espindola',
      domicilio: 'Franklin 650',
      coordenadas: {
        latitude: -34.607765,
        longitude: -58.440867,
      }
    } as Pasajero,
    {
      id: '3',
      nombre: 'Joaquin',
      apellido: 'Arnedo',
      domicilio: 'Planes 1250',
      coordenadas: {
        latitude: -34.613013,
        longitude: -58.451598,
      }
    } as Pasajero,
];

export const mockRecorridos: Recorrido[] = [];
for (let i = 1; i < 15; i++) {
  const esIda = i % 2 == 0;
  mockRecorridos.push({
    id: i.toString(),
    nombre: 'Técnica 9 turno ' + (esIda ? 'mañana ' : 'tarde ') + i.toString(),
    escuela: escuelaMock,
    esIda,
    horario: esIda ? '07:00' : '13:00',
    anio: '2022',
    pasajeros: pasajerosMock,
  });
}