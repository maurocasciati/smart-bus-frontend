import { LatLng } from 'react-native-maps';

export type PubNubEvent = {
  channel: string,  
  message: {
    enCurso: boolean,
    posicionChofer: LatLng,
  },
};