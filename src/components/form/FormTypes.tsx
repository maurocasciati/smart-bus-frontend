import { LatLng } from 'react-native-maps';

export type RecorridoFormType = {
    nombre: string,
    esIda: boolean,
    horario: string,
    idPasajeros: string[],
    idEscuela: string,
};

export type EscuelaFormType = {
    nombre: string,
    domicilio: DomicilioFormType,
    telefono: string,
};

export type PasajeroFormType = {
    nombre: string,
    apellido: string,
    nacimiento: string,
    domicilio: DomicilioFormType,
    telefono: string,
    piso_dpto: string,
};

export type DomicilioFormType = {
    domicilio: string,
    coordenadas: LatLng | null,
};