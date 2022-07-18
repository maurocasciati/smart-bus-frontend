import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { getRecorrido } from '../services/recorrido.service';
import { AuthContext } from '../auth/AuthProvider';
import NotFound from '../components/NotFound';
import { usePubNub } from 'pubnub-react';

export default function RecorridoEnCurso({ route, navigation }: RecorridoEnCursoProps) {
  const { recorrido } = route.params;
  const [currentPosition, setCurrentPosition] = useState<LatLng>();
  const [esRecorridoDeIda, setEsRecorridoDeIda] = useState<boolean>();
  const [quedanParadas, setQuedanParadas] = useState<boolean>(true);
  const [paradas, setParadas] = useState<Parada[]>();
  const [waypoints, setWaypoints] = useState<LatLng[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [toggleFocus, setToggleFocus] = useState<boolean>(true);

  const [mensajeError, setMensajeError] = useState<string | null>(null);
  
  const { token } = useContext(AuthContext);

  const mapRef = useRef<MapView>(null);
  const pubnub = usePubNub();
  const channel = recorrido.id.toString();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        await Location.requestForegroundPermissionsAsync();
        Location.watchPositionAsync({}, location => setCurrentPosition(location.coords));
        
        try {
          const recorridoResponse = await getRecorrido(token, recorrido.id);
          
          setEsRecorridoDeIda(recorridoResponse?.esRecorridoDeIda);
          
          recorridoResponse?.escuela && setParadas([
            ...recorridoResponse.esRecorridoDeIda ? [] : [mapEscuelaToParada(recorridoResponse.escuela)],
            ...mapPasajerosToParada(recorridoResponse.pasajeros),
            ...recorridoResponse.esRecorridoDeIda ? [mapEscuelaToParada(recorridoResponse.escuela)] : [],
          ]);
        } catch(error) {
          setLoading(false);
          setMensajeError(error as string);
        }
        setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    (() => {
      isMounted && setWaypoints(paradas && paradas.map((pasajero) => pasajero.coordenadas));
    })();
    return () => { isMounted = false; };
  }, [paradas]);

  useEffect(() => {
    let isMounted = true;
    (() => {
      if (paradas && isMounted && currentPosition) {
        toggleFocus
          ? mapRef.current?.animateToRegion(getFocusedRegion(currentPosition))
          : mapRef.current?.animateToRegion(getFocusedRegion(paradas[0].coordenadas));
      }
    })();
    return () => { isMounted = false; };
  }, [toggleFocus]);

  useEffect(() => {
    let isMounted = true;
    (() => {
      if (isMounted) {
        currentPosition && toggleFocus && mapRef.current?.animateToRegion(getFocusedRegion(currentPosition));
        currentPosition && waypoints && pubnub.publish({ channel, message: { enCurso: true, posicionChofer: currentPosition, waypoints }});
      }
    })();
    return () => { isMounted = false; };
  }, [currentPosition, waypoints]);

  useEffect(() => {
    navigation.addListener('beforeRemove', (event: any) => {
      event.preventDefault();
      console.log('posicion dentro es: ' + currentPosition);
  
      if (!quedanParadas) {
        pubnub.publish({ channel, message: { enCurso: false, posicionChofer: null, waypoints: [] }});
        Alert.alert('', `El recorrido ${recorrido.nombre} finalizó con éxito`);
        navigation.dispatch(event.data.action);
      } else {
        Alert.alert(
          'El recorrido sigue en curso',
          '¿Quiere interrumpirlo y darlo como finalizado?',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => null },
            {
              text: 'Interrumpir',
              style: 'destructive',
              onPress: () => {
                pubnub.publish({ channel, message: { enCurso: false, posicionChofer: null, waypoints: [] }});
                // TODO: Enviar notificacion a tutores de que el recorrido finalizo con interrupción
                Alert.alert('', `El recorrido ${recorrido.nombre} fue interrumpido`);
                navigation.dispatch(event.data.action);
              }
            },
          ]
        );
      }
    });
  }, [navigation, quedanParadas]);

  const finalizarRecorrido = () => navigation.navigate('RecorridoDetalle', { recorrido });

  const esUltimaParada = (): boolean => !!paradas && paradas.length <= 1;
  const animateToInitialRegion = (): void => currentPosition && mapRef.current?.animateToRegion(getFocusedRegion(currentPosition), 1);
  const removerParada = (): void => {
    paradas && paradas.length === 1 && setQuedanParadas(false);
    setParadas(paradas && paradas.slice(1));
  };

  const renderMap = () => {
    return loading && currentPosition ? null : (
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        onMapReady={animateToInitialRegion}
      >
        { paradas && paradas.map((parada) => 
          <Marker
            key={parada.id.toString() + parada.esEscuela}
            coordinate={parada.coordenadas}
            title={parada.esEscuela ? parada.nombre : parada.domicilio}
            image={parada.esEscuela ? require('../../assets/marker-school.png') : require('../../assets/marker-house.png')}/>
        )}

        { quedanParadas && <MapViewDirections
          origin={currentPosition}
          destination={paradas && paradas[0].coordenadas}
          apikey={GOOGLE_API_KEY}
          strokeWidth={5}
          strokeColor='orange'
        /> }

        { !esUltimaParada() && <MapViewDirections
          origin={paradas && paradas[0].coordenadas}
          destination={paradas && paradas[paradas.length - 1].coordenadas}
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
    return esRecorridoDeIda
      ? (
        <>
          <View style={{ flex: 1, margin: 5 }}>
            <ActionButton name='No sube' action={removerParada} secondary={true}></ActionButton>
          </View>
          <View style={{ flex: 3, margin: 5 }}>
            <ActionButton name='Confirmar subida' action={removerParada}></ActionButton>
          </View>
        </>
      ) : (
        <>
          <View style={{ flex: 1, margin: 5 }}>
            <ActionButton name='No baja' action={removerParada} secondary={true}></ActionButton>
          </View>
          <View style={{ flex: 3, margin: 5 }}>
            <ActionButton name='Confirmar bajada' action={removerParada}></ActionButton>
          </View>
        </>      
      );
  };
  
  const renderBotonEscuela = () => {
    return esRecorridoDeIda
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
      { mensajeError
        ? <NotFound error={mensajeError} />
        : <>
          { renderMap() }

          <View style={localstyles.detailsContainer}>
            { !quedanParadas
              ? renderFinalizarRecorrido()
              : <>
                <View style={localstyles.recorridoContainer}>
                  { paradas && paradas[0].esEscuela ? renderBotonEscuela() : renderBotonesPasajeros() }
                </View>
                <TouchableOpacity
                  style={localstyles.pasajerosContainer}
                  onPress={() => setToggleFocus(!toggleFocus)}
                >
                  <Text style={localstyles.pasajerosText}>Siguiente: {paradas && paradas[0].domicilio}</Text>
                </TouchableOpacity>
              </>
            }
          </View>
        </>
      }
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
