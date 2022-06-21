import React, { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RecorridoEnCursoProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { Parada, mapEscuelaToParada, mapPasajerosToParada } from '../domain/Parada';
import { getFocusedRegion } from '../utils/map.utils';
import { customMapStyle, GOOGLE_API_KEY } from '../constants';
import MapViewDirections from 'react-native-maps-directions';
import ActionButton from '../components/ActionButton';
import PrimaryButton from '../components/PrimaryButton';

export default function RecorridoEnCurso({ route, navigation }: RecorridoEnCursoProps) {
  const { recorrido } = route.params;
  const { pasajeros, escuela, esIda } = recorrido;
  const [currentPosition, setCurrentPosition] = useState<LatLng>({ longitude: 0, latitude: 0 });
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [waypoints, setWaypoints] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toggleFocus, setToggleFocus] = useState<boolean>(true);
  
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      Location.watchPositionAsync({}, location => isMounted && setCurrentPosition(location.coords));

      setParadas([
        ...esIda ? [] : [mapEscuelaToParada(escuela)],
        ...mapPasajerosToParada(pasajeros),
        ...esIda ? [mapEscuelaToParada(escuela)] : [],
      ]);

      setLoading(false);
    })();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setWaypoints(paradas.map((pasajero) => pasajero.coordenadas));
  }, [paradas]);

  useEffect(() => {
    toggleFocus
      ? mapRef.current?.animateToRegion(getFocusedRegion(currentPosition))
      : mapRef.current?.animateToRegion(getFocusedRegion(paradas[0].coordenadas));
  }, [toggleFocus]);

  useEffect(() => {
    toggleFocus && mapRef.current?.animateToRegion(getFocusedRegion(currentPosition));
  }, [currentPosition]);

  const finalizarRecorrido = () => {
    Alert.alert('', `El recorrido ${recorrido.nombre} finalizó con éxito`);
    navigation.navigate('RecorridoDetalle', { recorrido });
  };

  const finalizarHabilitado = (): boolean => paradas.length === 0;
  const esUltimaParada = (): boolean => paradas.length > 1;
  const removerParada = (): void => setParadas(paradas.slice(1));
  const animateToInitialRegion = (): void => mapRef.current?.animateToRegion(getFocusedRegion(currentPosition), 1);

  const renderMap = () => {
    return loading ? null : (
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        onMapReady={animateToInitialRegion}
      >
        { paradas.map((parada) => 
          <Marker
            key={parada.id.toString() + parada.esEscuela}
            coordinate={parada.coordenadas}
            title={parada.esEscuela ? parada.nombre : parada.domicilio}
            image={parada.esEscuela ? require('../../assets/marker-school.png') : require('../../assets/marker-house.png')}/>
        )}

        { !finalizarHabilitado() && <MapViewDirections
          origin={currentPosition}
          destination={paradas[0].coordenadas}
          apikey={GOOGLE_API_KEY}
          strokeWidth={5}
          strokeColor='orange'
        /> }

        { esUltimaParada() && <MapViewDirections
          origin={paradas[0].coordenadas}
          destination={paradas[paradas.length - 1].coordenadas}
          waypoints={waypoints}
          optimizeWaypoints={false} // Poner en true cuando tengamos order automatico.
          splitWaypoints={true}
          apikey={GOOGLE_API_KEY}
          strokeWidth={2}
          strokeColor='orange'
        /> }
      </MapView>
    );
  };

  const renderBotonesPasajeros = () => {
    return esIda
      ? (
        <>
          <View style={{ flex: 1, margin: 5 }}>
            <ActionButton name='No sube' action={removerParada}></ActionButton>
          </View>
          <View style={{ flex: 3, margin: 5 }}>
            <ActionButton name='Confirmar subida' action={removerParada}></ActionButton>
          </View>
        </>
      ) : (
        <>
          <View style={{ flex: 1, margin: 5 }}>
            <ActionButton name='No baja' action={removerParada}></ActionButton>
          </View>
          <View style={{ flex: 3, margin: 5 }}>
            <ActionButton name='Confirmar bajada' action={removerParada}></ActionButton>
          </View>
        </>      
      );
  };
  
  const renderBotonEscuela = () => {
    return esIda
      ? (
        <View style={{ flex: 1, margin: 5 }}>
          <ActionButton name={'Llegada a la escuela'} action={removerParada}/>
        </View>
      ) : (
        <View style={{ flex: 1, margin: 5 }}>
          <ActionButton name={'Salida de la escuela'} action={removerParada}/>
        </View>
      );
  };

  const renderFinalizarRecorrido = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <PrimaryButton name={'Finalizar recorrido'} action={finalizarRecorrido}/>
      </View>
    );
  };

  return loading ? null : (
    <View style={styles.container}>
      { renderMap() }

      <View style={localstyles.detailsContainer}>
        { finalizarHabilitado()
          ? renderFinalizarRecorrido()
          : <>
            <View style={localstyles.recorridoContainer}>
              { paradas[0].esEscuela ? renderBotonEscuela() : renderBotonesPasajeros() }
            </View>
            <TouchableOpacity
              style={localstyles.pasajerosContainer}
              onPress={() => setToggleFocus(!toggleFocus)}
            >
              <Text style={localstyles.pasajerosText}>Siguiente: {paradas[0].domicilio}</Text>
            </TouchableOpacity>
          </>
        }
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
