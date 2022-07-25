import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { RecorridoEnCursoTutorProps } from '../../components/Navigation';
import { styles } from '../../styles/styles';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { getDistance, getRegionForCoordinates } from '../../utils/map.utils';
import { customMapStyle, GOOGLE_API_KEY } from '../../constants';
import MapViewDirections from 'react-native-maps-directions';
import { usePubNub } from 'pubnub-react';
import { PubNubEvent } from '../../domain/PubNubEvent';
import ModalConfirmacion from '../../components/ModalConfirmacion';
import { useFocusEffect } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import Notificacion from '../../components/Notificacion';

export default function RecorridoEnCursoTutor({ route, navigation }: RecorridoEnCursoTutorProps) {
  const { recorrido, eventoRecorrido } = route.params;

  const [enCurso, setEnCurso] = useState<boolean>(eventoRecorrido.message.enCurso);
  const [posicionChofer, setPosicionChofer] = useState<LatLng>(eventoRecorrido.message.posicionChofer);
  const [waypoints, setWaypoints] = useState<LatLng[]>(eventoRecorrido.message.waypoints);
  const [pasoPorDomicilio, setPasoPorDomicilio] = useState<boolean>(false);
  const [pasoPorEscuela, setPasoPorEscuela] = useState<boolean>(false);
  const [soloQuedaEscuela, setSoloQuedaEscuela] = useState<boolean>(false);
  const [esElSiguiente, setEsElSiguiente] = useState<boolean>(false);
  const [textoNotificacion, setTextoNotificacion] = useState<string>();

  const mapRef = useRef<MapView>(null);
  const pubnub = usePubNub();
  const channel = recorrido.id.toString();

  useFocusEffect(
    useCallback(() => {
      const listener = {
        message: (event: PubNubEvent) => {
          setEnCurso(event.message.enCurso);
          event.message.posicionChofer && setPosicionChofer(event.message.posicionChofer);
          event.message.waypoints && setWaypoints(event.message.waypoints);
        }
      };
      const subscription = { channels: [channel], withPresence: true };

      pubnub.addListener(listener);
      pubnub.subscribe(subscription);

      return () => {
        pubnub.removeListener(listener);
        pubnub.unsubscribe(subscription);
      };
    }, [pubnub])
  );

  useFocusEffect(
    useCallback(() => {
      if (esElSiguiente && recorrido.pasajeros.some((p) => getDistance(posicionChofer, p.domicilio.coordenadas) < 500)) {
        setTextoNotificacion('¡El micro está cerca!');
      } else {
        setTextoNotificacion(undefined);
      }
      mapRef.current?.animateToRegion(getRegionForCoordinates([...waypoints, posicionChofer]));
    }, [posicionChofer, esElSiguiente])
  );

  useFocusEffect(
    useCallback(() => {
      setSoloQuedaEscuela(waypoints.every((w) => !!recorrido.escuela && recorrido.escuela.direccion.coordenadas.latitude === w.latitude && recorrido.escuela.direccion.coordenadas.longitude === w.longitude));
      setPasoPorEscuela(!waypoints.some((w) => !!recorrido.escuela && recorrido.escuela.direccion.coordenadas.latitude === w.latitude && recorrido.escuela.direccion.coordenadas.longitude === w.longitude));
      setPasoPorDomicilio(!recorrido.pasajeros
        .some((p) => waypoints.some((w) => w.latitude === p.domicilio.coordenadas.latitude && w.longitude === p.domicilio.coordenadas.longitude)));
      setEsElSiguiente(waypoints[0] && recorrido.pasajeros
        .some((p) => p.domicilio.coordenadas.latitude === waypoints[0].latitude && p.domicilio.coordenadas.longitude === waypoints[0].longitude));
    }, [waypoints])
  );

  const focus = () => mapRef.current?.animateToRegion(getRegionForCoordinates([...waypoints, posicionChofer]));

  const renderMap = () => {
    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        onMapReady={focus}
      >
        { recorrido.pasajeros.map((pasajero) => 
          <Marker
            key={pasajero.id.toString()}
            coordinate={pasajero.domicilio.coordenadas}
            title={pasajero.domicilio.domicilio}
            image={require('../../../assets/marker-house.png')}/>
        )}

        { recorrido.escuela &&
          <Marker
            key={'escuela-' + recorrido.escuela.id.toString()}
            coordinate={recorrido.escuela.direccion.coordenadas}
            title={recorrido.escuela.direccion.domicilio}
            image={require('../../../assets/marker-school.png')}/>
        }

        { posicionChofer &&
          <Marker
            key={'chofer-' + recorrido.chofer.id.toString()}
            coordinate={posicionChofer}
            title={recorrido.chofer.nombre + ' ' + recorrido.chofer.apellido}
            image={require('../../../assets/marker-bus.png')}/>
        }

        <MapViewDirections
          origin={posicionChofer}
          destination={waypoints[waypoints.length-1]}
          waypoints={waypoints}
          splitWaypoints={true}
          apikey={GOOGLE_API_KEY}
          strokeWidth={2}
          strokeColor='orange'
        />
      </MapView>
    );
  };

  const renderDetalles = () => {
    return recorrido.esRecorridoDeIda ? (
      <View style={localstyles.detailsContainer}>
        <View style={localstyles.recorridoContainer}>
          <Checkbox value={true} color={'orange'}/>
          <Text style={localstyles.item}>{'El chofer inició el recorrido'}</Text>
        </View>
        <View style={localstyles.recorridoContainer}>
          <Checkbox value={pasoPorDomicilio} color={'orange'}/>
          <Text style={localstyles.item}>{ pasoPorDomicilio ? 'El pasajero ya está en el micro' : esElSiguiente ? '¡El micro está en camino!' : 'Buscando otros pasajeros...' }</Text>
        </View>
        <View style={localstyles.recorridoContainer}>
          <Checkbox value={pasoPorEscuela} color={'orange'}/>
          <Text style={localstyles.item}>{ !soloQuedaEscuela ? 'El recorrido esta en curso' : pasoPorEscuela ? '¡El micro llegó a la Escuela!' : 'El micro está en camino a la escuela' }</Text>
        </View>
      </View>
    ) : (
      <View style={localstyles.detailsContainer}>
        <View style={localstyles.recorridoContainer}>
          <Checkbox value={true} color={'orange'}/>
          <Text style={localstyles.item}>{'El chofer inició el recorrido'}</Text>
        </View>
        <View style={localstyles.recorridoContainer}>
          <Checkbox value={pasoPorEscuela} color={'orange'}/>
          <Text style={localstyles.item}>{ pasoPorEscuela ? '¡Todos a bordo del micro!' : 'El micro está en camino a la escuela' }</Text>
        </View>
        <View style={localstyles.recorridoContainer}>
          <Checkbox value={pasoPorDomicilio} color={'orange'}/>
          <Text style={localstyles.item}>{ pasoPorEscuela ? pasoPorDomicilio ? '¡El micro llegó a casa!' : 'Los pasajeros van camino a casa' : 'Los pasajeros todavía no salieron' }</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      { renderMap() }
      { renderDetalles() }

      <ModalConfirmacion
        visible={!enCurso}
        text={'El chofer ha finalizado el recorrido'}
        cancel={() => navigation.navigate('RecorridoListado')}
      />

      <Notificacion
        visible={!!textoNotificacion}
        text={textoNotificacion || ''}
      />
    </View>
  );
}

const localstyles = StyleSheet.create({
  detailsContainer: {
    marginTop: -150,
    borderRadius: 20,
    elevation: 6,
    backgroundColor: '#fff',
    margin: 25,
    flex: 2,
  },
  recorridoContainer: {
    flexDirection: 'row',
    padding: 10,
    flex: 1,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  item: {
    paddingLeft: 10,
    fontSize: 16,
    flex: 3,
    alignItems: 'center'
  },
});
