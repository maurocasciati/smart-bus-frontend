import { Escuela } from './domain/Escuela';
import { EstadoDeCuenta } from './domain/EstadoDeCuenta';
import { Pasajero } from './domain/Pasajero';
import { Recorrido } from './domain/Recorrido';

export const escuelasMock = [
  {
    id: 3,
    nombre: 'Escuela Técnica N° 9',
    direccion: {
      domicilio: 'Gral. Martín de Gainza 1050',
      coordenadas: {
        latitude: -34.608751,
        longitude: -58.446538,
      },
    },
  } as Escuela,
  {
    id: 2,
    nombre: 'Colegio Marianista',
    direccion: {
      domicilio: 'Avenida Rivadavia 5652',
      coordenadas: {
        latitude: -34.622168,
        longitude: -58.444967,
      },
    },
  } as Escuela,
  {
    id: 5,
    nombre: 'Instituto Ferro Carril Oeste',
    direccion: {
      domicilio: 'Bacacay 1050',
      coordenadas: {
        latitude: -34.618994,
        longitude: -58.444184,
      },
    },
  } as Escuela,
  {
    id: 1002,
    nombre: 'Instituto Redemptrix Captivorum',
    direccion: {
      domicilio: 'Espinosa 1220',
      coordenadas: {
        latitude: -34.609023,
        longitude: -58.453580,
      },
    },
  } as Escuela,
  
];

export const pasajerosMock = [
    {
      id: 3,
      nombre: 'Mauro',
      apellido: 'Casciati',
      domicilio: {
        domicilio: 'Valle 1208',
        coordenadas: {
          latitude: -34.625542,
          longitude: -58.445162,
        },
      },
    } as Pasajero,
    {
      id: 4,
      nombre: 'Nicolas',
      apellido: 'Espindola',
      domicilio: {
        domicilio: 'F. J. Seguí 638',
        coordenadas: {
          latitude: -34.617460,
          longitude: -58.455455,
        },
      },
    } as Pasajero,
    {
      id: 5,
      nombre: 'Joaquin',
      apellido: 'Arnedo',
      domicilio: {
        domicilio: 'Thames 150',
        coordenadas: {
          latitude: -34.598409,
          longitude: -58.447132,
        },
      },
    } as Pasajero,
];

export const mockRecorridos: Recorrido[] = [];
for (let i = 0; i < 4; i++) {
  mockRecorridos.push({
    id: i,
    nombre: escuelasMock[i].nombre.split(' ').slice(1).join(' '),
    escuela: escuelasMock[i],
    esRecorridoDeIda: true,
    horario: '07:00',
    pasajeros: pasajerosMock,
  });
  mockRecorridos.push({
    id: (i+4),
    nombre: escuelasMock[i].nombre.split(' ').slice(1).join(' ') + ' (regreso)',
    escuela: escuelasMock[i],
    esRecorridoDeIda: false,
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