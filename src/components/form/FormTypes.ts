import { LatLng } from 'react-native-maps';

export type SignUpFormType = {
    nombre: string,
    apellido: string,
    email: string,
    contraseña: string
};

export type RecorridoFormType = {
    nombre: string,
    esIda: boolean,
    horario: string,
    idPasajeros: number[],
    idEscuela: number,
};

export type EscuelaFormType = {
    nombre: string,
    direccion: DomicilioFormType | null,
};

export type PasajeroFormType = {
    nombre: string,
    apellido: string,
    fechaNacimiento: string,
    telefono: string,
    domicilio: DomicilioFormType | null,
    pisoDepartamento: string,
};

export type DomicilioFormType = {
    domicilio: string,
    coordenadas: LatLng | null,
};

export type EventualidadAusenciaFormType = {
    desde: string,
    hasta: string,
};

export type EventualidadDomicilioFormType = {
    desde: string,
    hasta: string,
    domicilio: DomicilioFormType | null,
};
