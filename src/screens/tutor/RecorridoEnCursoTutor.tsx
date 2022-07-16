import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RecorridoEnCursoProps } from '../../components/Navigation';
import { styles } from '../../styles/styles';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { getRegionForCoordinates } from '../../utils/map.utils';
import { customMapStyle, GOOGLE_API_KEY } from '../../constants';
import MapViewDirections from 'react-native-maps-directions';
import ActionButton from '../../components/ActionButton';
import { usePubNub } from 'pubnub-react';
import { PubNubEvent } from '../../domain/PubNubEvent';

export default function RecorridoEnCursoTutor({ route, navigation }: RecorridoEnCursoProps) {
  const { recorrido } = route.params;
  const [enCurso, setEnCurso] = useState<boolean>(true);
  const [posicionChofer, setPosicionChofer] = useState<LatLng>();
  const [waypoints, setWaypoints] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);
  const pubnub = usePubNub();
  const channel = recorrido.id.toString();

  const handleMessage = (event: PubNubEvent) => {
    setEnCurso(event.message.enCurso);
  };

  useEffect(() => {
    let isMounted = true;
    
    (() => {
      if (isMounted) {
        setWaypoints(recorrido.pasajeros.map((pasajero) => pasajero.domicilio.coordenadas));
        setPosicionChofer({ latitude: -34.616771, longitude: -58.444594 });
      }
    })();
    
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    (() => {
      if (isMounted) {
        pubnub.subscribe({ channels: [channel], withPresence: true });
        pubnub.addListener({ message: handleMessage });
      }
    })();
    
    return () => { isMounted = false; };
  }, [pubnub]);

  const focus = () => mapRef.current?.animateToRegion(
    getRegionForCoordinates([
      ...(posicionChofer ? [posicionChofer] : []),
      ...(recorrido.escuela ? [recorrido.escuela.direccion.coordenadas] : []),
      ...waypoints,
    ])
  );

  const renderMap = () => {
    return loading ? null : (
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        onMapReady={focus}
      >
        {/* TODO: Reemplazar por el que esta comentado cuando el get recorrido traiga filtados */}
        <Marker
          key={recorrido.pasajeros[0].id.toString()}
          coordinate={recorrido.pasajeros[2].domicilio.coordenadas}
          title={recorrido.pasajeros[2].domicilio.domicilio}
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

  return loading ? null : (
    <View style={styles.container}>
      { renderMap() }

      <View style={localstyles.detailsContainer}>
        <View style={localstyles.recorridoContainer}>
          <View style={{ flex: 1, margin: 5 }}>
            <ActionButton name='No sube' action={() => null} secondary={true}></ActionButton>
          </View>
          <View style={{ flex: 3, margin: 5 }}>
            <ActionButton name='Center' action={focus}></ActionButton>
          </View>
        </View>
        <TouchableOpacity
          style={localstyles.pasajerosContainer}
          onPress={() => null}
        >
          <Text style={localstyles.pasajerosText}>Siguiente: </Text>
        </TouchableOpacity>
      </View>
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
