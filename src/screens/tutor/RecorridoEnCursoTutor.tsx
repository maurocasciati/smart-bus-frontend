import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RecorridoEnCursoTutorProps } from '../../components/Navigation';
import { styles } from '../../styles/styles';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { getRegionForCoordinates } from '../../utils/map.utils';
import { customMapStyle, GOOGLE_API_KEY } from '../../constants';
import MapViewDirections from 'react-native-maps-directions';
import ActionButton from '../../components/ActionButton';
import { usePubNub } from 'pubnub-react';
import { PubNubEvent } from '../../domain/PubNubEvent';
import ModalConfirmacion from '../../components/ModalConfirmacion';

export default function RecorridoEnCursoTutor({ route, navigation }: RecorridoEnCursoTutorProps) {
  const { recorrido, eventoRecorrido } = route.params;

  const [enCurso, setEnCurso] = useState<boolean>(eventoRecorrido.message.enCurso);
  const [posicionChofer, setPosicionChofer] = useState<LatLng>(eventoRecorrido.message.posicionChofer);
  const [waypoints, setWaypoints] = useState<LatLng[]>(eventoRecorrido.message.waypoints);

  const mapRef = useRef<MapView>(null);
  const pubnub = usePubNub();
  const channel = recorrido.id.toString();

  useEffect(() => {
    let isMounted = true;
    
    (() => {
      if (isMounted) {
        pubnub.subscribe({ channels: [channel], withPresence: true });
        pubnub.addListener({
          message: (event: PubNubEvent) => {
            setEnCurso(event.message.enCurso);
            setWaypoints(event.message.waypoints);
            setPosicionChofer(event.message.posicionChofer);
          }
        });
      }
    })();
    
    return () => { isMounted = false; };
  }, [pubnub]);

  useEffect(() => {
    let isMounted = true;
    
    (() => {
      if (isMounted) {
        focus();
      }
    })();
    
    return () => { isMounted = false; };
  }, [posicionChofer]);

  const focus = () => mapRef.current?.animateToRegion(getRegionForCoordinates([...waypoints, posicionChofer]));

  const renderMap = () => {
    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        onMapReady={focus}
      >
        {/* TODO: Reemplazar por el que esta comentado cuando el get recorrido traiga filtados */}
        <Marker
          key={recorrido.pasajeros[1].id.toString()}
          coordinate={recorrido.pasajeros[1].domicilio.coordenadas}
          title={recorrido.pasajeros[1].domicilio.domicilio}
          image={require('../../../assets/marker-house.png')}/>
        {/*
        { recorrido.pasajeros.map((pasajero) => 
          <Marker
            key={pasajero.id.toString()}
            coordinate={pasajero.domicilio.coordenadas}
            title={pasajero.domicilio.domicilio}
            image={require('../../../assets/marker-house.png')}/>
        )}
        */}
        

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

  return (
    <View style={styles.container}>
      { renderMap() }

      <View style={localstyles.detailsContainer}>
        <View style={localstyles.recorridoContainer}>
          {/* <View style={{ flex: 1, margin: 5 }}>
            <ActionButton name='No sube' action={() => null} secondary={true}></ActionButton>
          </View> */}
          <View style={{ flex: 3, margin: 5 }}>
            <ActionButton name='Centrar mapa' action={focus}></ActionButton>
          </View>
        </View>
        {/* 
          Agregar mensaje cuando pasajero sube
          Agregar mensaje cuando recorrido llega a la escuela
          Ver diferencias entre ida y vuelta
          Ver que mostrar apensa arranca/cuando no paso nada todavia
        */}


        {/* <TouchableOpacity
          style={localstyles.pasajerosContainer}
          onPress={() => null}
        >
          <Text style={localstyles.pasajerosText}>Siguiente: </Text>
        </TouchableOpacity> */}
      </View>

      <ModalConfirmacion
        visible={!enCurso}
        text={'El chofer ha finalizado el recorrido'}
        cancel={() => navigation.navigate('RecorridoDetalleTutor', { recorrido })}
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
  pasajerosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    flex: 1,
  },
  pasajerosText: {
    fontSize: 18,
    flex: 3,
  },
});
