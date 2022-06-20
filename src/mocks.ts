import { Escuela } from './domain/Escuela';
import { EstadoDeCuenta } from './domain/EstadoDeCuenta';
import { Pasajero } from './domain/Pasajero';
import { Recorrido } from './domain/Recorrido';

export const escuelasMock = [
  {
    id: '1',
    nombre: 'Escuela Técnica N° 9',
    domicilio: 'Gral. Martín de Gainza 1050',
    telefono: '1122334455',
    coordenadas: {
      latitude: -34.608751,
      longitude: -58.446538,
    },
    esEscuela: true,
  } as Escuela,
  {
    id: '2',
    nombre: 'Colegio Marianista',
    domicilio: 'Avenida Rivadavia 5652',
    telefono: '1122334455',
    coordenadas: {
      latitude: -34.622168,
      longitude: -58.444967,
    },
    esEscuela: true,
  } as Escuela,
  {
    id: '3',
    nombre: 'Instituto educativo Ferro Carril Oeste',
    domicilio: 'Bacacay 1050',
    telefono: '1122334455',
    coordenadas: {
      latitude: -34.618994,
      longitude: -58.444184,
    },
    esEscuela: true,
  } as Escuela,
  {
    id: '4',
    nombre: 'Instituto Redemptrix Captivorum',
    domicilio: 'Espinosa 1220',
    telefono: '1122334455',
    coordenadas: {
      latitude: -34.609023,
      longitude: -58.453580,
    },
    esEscuela: true,
  } as Escuela,
  
];

export const pasajerosMock = [
    {
      id: '1',
      nombre: 'Mauro',
      apellido: 'Casciati',
      domicilio: 'Valle 1208',
      coordenadas: {
        latitude: -34.625542,
        longitude: -58.445162,
      }
    } as Pasajero,
    {
      id: '2',
      nombre: 'Nicolas',
      apellido: 'Espindola',
      domicilio: 'F. J. Seguí 638',
      coordenadas: {
        latitude: -34.617460,
        longitude: -58.455455,
      }
    } as Pasajero,
    {
      id: '3',
      nombre: 'Joaquin',
      apellido: 'Arnedo',
      domicilio: 'Thames 150',
      coordenadas: {
        latitude: -34.598409,
        longitude: -58.447132,
      }
    } as Pasajero,
];

export const mockRecorridos: Recorrido[] = [];
for (let i = 0; i < 4; i++) {
  mockRecorridos.push({
    id: i.toString(),
    nombre: escuelasMock[i].nombre + ' turno mañana ',
    escuela: escuelasMock[i],
    esIda: true,
    horario: '07:00',
    pasajeros: pasajerosMock,
  });
  mockRecorridos.push({
    id: (i+4).toString(),
    nombre: escuelasMock[i].nombre + ' turno tarde ',
    escuela: escuelasMock[i],
    esIda: false,
    horario: '13:00',
    pasajeros: pasajerosMock,
  });
}

export const mockEstadoDeCuenta: EstadoDeCuenta = {
  pago_enero: true,
  pago_febrero: true,
  pago_marzo: true,
  pago_abril: true,
  pago_mayo: false,
  pago_junio: false,
  pago_julio: false,
  pago_agosto: false,
  pago_septiembre: false,
  pago_octubre: false,
  pago_noviembre: false,
  pago_diciembre: false,
};