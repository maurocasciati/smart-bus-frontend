/* eslint-disable indent */
import { HistorialRecorrido } from '../domain/HistorialRecorrido';
import { Recorrido } from '../domain/Recorrido';
import { mapDateTimeStringToDate, mapDateTimeStringToTime } from './date.utils';

export const getCertificadoHTML = (recorrido: Recorrido, historialRecorrido: HistorialRecorrido) => `
    <body>
        <h2 align=center style=font-size:32px>
            Escol.ar
        </h2>
        <h1 align=center style=font-size:40px>
            ${historialRecorrido.recorrido.escuela?.nombre}
        </h1>
        <br/>
        <p style=font-size:28px>
            Mediante el presente certificado informamos que el día ${mapDateTimeStringToDate(historialRecorrido.fechaInicio)} 
            ${recorrido.pasajeros.length > 1
                ? 'los alumnos' + recorrido.pasajeros.map((p) => ' ' + p.apellido + ' ' + p.nombre) + ' llegaron '
                : 'el alumno ' + recorrido.pasajeros[0].apellido + ' ' + recorrido.pasajeros[0].nombre + ' llegó '
            }
            tarde a la escuela debido a que el recorrido ${historialRecorrido.recorrido.nombre}
            a cargo del chofer ${historialRecorrido.recorrido.chofer.apellido} ${historialRecorrido.recorrido.chofer.nombre} 
            finalizó a las ${historialRecorrido.fechaParadaEscuela
                ? mapDateTimeStringToTime(historialRecorrido.fechaParadaEscuela)
                : mapDateTimeStringToTime(historialRecorrido.fechaFinalizacion)
            }.
        </p>
    </body>
`;