import { LatLng } from 'react-native-maps';

export type PubNubEvent = {
  channel: string,  
  message: {
    enCurso: boolean,
    posicionChofer: LatLng,
    waypoints: LatLng[],
    // TODO: Borrar los ultimos dos cuando implementemos notificaciones push
    irregularidad: string,
    aviso: number,
  },
};