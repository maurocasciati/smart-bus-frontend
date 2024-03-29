import { LatLng } from 'react-native-maps';

export type DataInicialRegistroType = {
    fueActivado?: boolean,
    email: string,
    tipoDeUsuario: number,
};

export type SignUpFormType = {
    nombre: string,
    apellido: string,
    email: string,
    contraseña: string,
    tipoDeUsuario: number,
};

export type RecorridoFormType = {
    id: number,
    nombre: string,
    esRecorridoDeIda: boolean,
    horario: string,
    idPasajeros: number[],
    idEscuela: number,
    idChofer: number,
    pasajeros?: { idPasajero: number, orden: number }[],
};

export type EscuelaFormType = {
    id: number,
    nombre: string,
    direccion: DomicilioFormType | null,
    emailUsuario: string,
    emailUsuarios: string[],
};

export type PasajeroFormType = {
    id: number,
    nombre: string,
    apellido: string,
    fechaNacimiento: string,
    nacimiento: Date,
    telefono: string,
    domicilio: DomicilioFormType | null,
    pisoDepartamento: string,
    emailTutor: string,
    emailTutores: string[],
};

export type DomicilioFormType = {
    domicilio: string,
    coordenadas: LatLng | null,
};

export type EventualidadFormType = {
    idPasajero: number,
    idRecorrido: number,
    fechaInicio: string,
    fechaFin: string,
    inicio: Date,
    fin: Date,
    duracion: string,
    direccion: DomicilioFormType | null,
};

export type HistorialRecorridoType = {
    idRecorrido: number,
    fechaInicio: Date,
    fechaFinalizacion?: Date,
    fechaParadaEscuela?: Date,
    paradas: {
        idPasajero: number,
        fechaParada: Date,
        exito: boolean,
    }[],
    interrumpido: boolean,
    irregularidades: {
        fechaIrregularidad: Date,
        descripcion: string,
    }[],
}
