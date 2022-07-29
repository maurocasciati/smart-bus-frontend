import React, { useContext, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RecorridoEnCursoProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { Parada, mapEscuelaToParada, mapPasajerosToParada } from '../domain/Parada';
import { getDistance, getFocusedRegion } from '../utils/map.utils';
import { customMapStyle, GOOGLE_API_KEY } from '../constants';
import MapViewDirections from 'react-native-maps-directions';
import ActionButton from '../components/ActionButton';
import PrimaryButton from '../components/PrimaryButton';
import { getRecorrido } from '../services/recorrido.service';
import { AuthContext } from '../auth/AuthProvider';
import NotFound from '../components/NotFound';
import { usePubNub } from 'pubnub-react';
import { LocationPermissionResponse, LocationSubscription } from 'expo-location';
import { postHistorialRecorrido } from '../services/historial.service';
import { HistorialRecorridoType } from '../components/form/FormTypes';
import ModalInput from '../components/ModalInput';
import { getNowDate } from '../utils/date.utils';

export default function RecorridoEnCurso({ route, navigation }: RecorridoEnCursoProps) {
  const { recorrido } = route.params;
  const [currentPosition, setCurrentPosition] = useState<LatLng>();
  const [esRecorridoDeIda, setEsRecorridoDeIda] = useState<boolean>();
  const [quedanParadas, setQuedanParadas] = useState<boolean>(true);
  const [paradas, setParadas] = useState<Parada[]>();
  const [waypoints, setWaypoints] = useState<LatLng[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [toggleFocus, setToggleFocus] = useState<boolean>(true);
  const [lejosDeProximaParada, setLejosDeProximaParada] = useState<boolean>(true);
  const [mostrarNotificarIrregularidad, setMostrarNotificarIrregularidad] = useState<boolean>(false);
  const [historialRecorrido, setHistorialRecorrido] = useState<HistorialRecorridoType>({
    idRecorrido: recorrido.id,
    fechaInicio: getNowDate(),
    fechaFinalizacion: undefined,
    fechaParadaEscuela: undefined,
    paradas: [],
    interrumpido: false,
    irregularidades: [],
  });

  const [mensajeError, setMensajeError] = useState<string | null>(null);
  
  const { token } = useContext(AuthContext);

  const mapRef = useRef<MapView>(null);
  const pubnub = usePubNub();
  const channel = recorrido.id.toString();

  useEffect(() => {
    let isMounted = true;
    let watchPositionPromise: LocationSubscription;
    let requestPermissionPromise: LocationPermissionResponse;
    (async () => {
      if (isMounted) {
        watchPositionPromise = await Location.watchPositionAsync({}, location => setCurrentPosition(location.coords));
        requestPermissionPromise = await Location.requestForegroundPermissionsAsync();
        if (!requestPermissionPromise.granted) {
          setMensajeError('La aplicación no tiene permisos para usar la ubicación del dispositivo');
        }
        
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
    return () => { 
      isMounted = false;
      watchPositionPromise.remove();
    };
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
        setLejosDeProximaParada(!!currentPosition && !!waypoints && waypoints[0] && (getDistance(currentPosition, waypoints[0]) > 150));
        currentPosition && toggleFocus && mapRef.current?.animateToRegion(getFocusedRegion(currentPosition));
        currentPosition && waypoints && pubnub.publish({ channel, message: { enCurso: true, posicionChofer: currentPosition, waypoints }});
      }
    })();
    return () => { isMounted = false; };
  }, [currentPosition, waypoints]);

  useEffect(() => {
    const unsuscribe = navigation.addListener('beforeRemove', (event: any) => {
      event.preventDefault();
  
      if (!quedanParadas) {
        finalizarRecorrido(event, false);
      } else {
        Alert.alert(
          'El recorrido sigue en curso',
          '¿Quiere interrumpirlo y darlo como finalizado?',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => null },
            { text: 'Interrumpir', style: 'destructive', onPress: () => finalizarRecorrido(event, true) },
          ]
        );
      }
    });

    return unsuscribe;
  }, [navigation, quedanParadas, historialRecorrido]);

  const finalizarRecorrido = async (navigationEvent: any, interrumpido: boolean) => {
    try {
      const resp = await postHistorialRecorrido(token, {
        ...historialRecorrido,
        fechaFinalizacion: getNowDate(),
        interrumpido,
      });
      if (resp) {
        if (interrumpido) {
          // TODO: Enviar notificacion a tutores de que el recorrido finalizo con interrupción
          Alert.alert('', `El recorrido ${recorrido.nombre} fue interrumpido`);
        } else {
          Alert.alert('', `El recorrido ${recorrido.nombre} finalizó con éxito`);
        }
        pubnub.publish({ channel, message: { enCurso: false, posicionChofer: null, waypoints: [] }});
        navigation.dispatch(navigationEvent.data.action);
      } else {
        throw 'El servidor no responde';
      }
    } catch(error) {
      Alert.alert('', `Error al finalizar el recorrido: ${error}`);
    }
  };

  const esUltimaParada = (): boolean => !!paradas && paradas.length <= 1;
  const animateToInitialRegion = (): void => currentPosition && mapRef.current?.animateToRegion(getFocusedRegion(currentPosition));
  const paradaPasajero = (exito: boolean): void => {
    if (paradas && paradas.length > 0) {
      setHistorialRecorrido({
        ...historialRecorrido,
        paradas: [
          ...historialRecorrido.paradas,
          {
            idPasajero: paradas[0].id,
            fechaParada: getNowDate(),
            exito,
          },
        ],
      });
    }
    removerParada();
  };
  const paradaEscuela = (): void => {
    setHistorialRecorrido({
      ...historialRecorrido,
      fechaParadaEscuela: getNowDate(),
    });
    removerParada();
  };
  const removerParada = (): void => {
    paradas && paradas.length === 1 && setQuedanParadas(false);
    setParadas(paradas && paradas.slice(1));
  };

  const notificarIrregularidad = (texto: string): void => {
    setHistorialRecorrido({
      ...historialRecorrido,
      irregularidades: [
        ...historialRecorrido.irregularidades,
        {
          fechaIrregularidad: getNowDate(),
          descripcion: texto,
        }
      ]
    });
    pubnub.publish({ channel, message: { enCurso: true, posicionChofer: currentPosition, waypoints, irregularidad: texto }});
  };

  const darAviso = (): void => {
    paradas && paradas[0] && pubnub.publish({ channel, message: { enCurso: true, posicionChofer: currentPosition, waypoints, aviso: paradas[0].id }});
  };

  const renderMap = () => {
    return loading && currentPosition ? null : (
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
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
            <ActionButton name='No sube' action={() => paradaPasajero(false)} secondary={true}></ActionButton>
          </View>
          <View style={{ flex: 3, margin: 5 }}>
            <ActionButton name='Confirmar subida' action={() => paradaPasajero(true)} disabled={lejosDeProximaParada}></ActionButton>
          </View>
        </>
      ) : (
        <>
          <View style={{ flex: 1, margin: 5 }}>
            <ActionButton name='No baja' action={() => paradaPasajero(false)} secondary={true}></ActionButton>
          </View>
          <View style={{ flex: 3, margin: 5 }}>
            <ActionButton name='Confirmar bajada' action={() => paradaPasajero(true)} disabled={lejosDeProximaParada}></ActionButton>
          </View>
        </>      
      );
  };
  
  const renderBotonEscuela = () => {
    return esRecorridoDeIda
      ? (
        <View style={{ flex: 1, margin: 5 }}>
          <ActionButton name={'Llegada a la escuela'} action={paradaEscuela} disabled={lejosDeProximaParada}/>
        </View>
      ) : (
        <View style={{ flex: 1, margin: 5 }}>
          <ActionButton name={'Salida de la escuela'} action={paradaEscuela} disabled={lejosDeProximaParada}/>
        </View>
      );
  };

  const renderFinalizarRecorrido = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <PrimaryButton name={'Finalizar recorrido'} action={() => navigation.navigate('RecorridoDetalle', { recorrido })}/>
      </View>
    );
  };

  return loading ? null : ( mensajeError
    ? <NotFound error={mensajeError} />
    : <>
      <View style={styles.container}>
        { renderMap() }

        <View style={localstyles.headerContainer}>
          <View style={localstyles.botonHeader}>
            <ActionButton name='Centrar' action={animateToInitialRegion} secondary={true}></ActionButton>
          </View>
          <View style={localstyles.botonHeader}>
            <ActionButton name='Irregularidad' action={() => setMostrarNotificarIrregularidad(true)} secondary={true}></ActionButton>
          </View>
          <View style={localstyles.botonHeader}>
            <ActionButton name='Dar aviso' action={darAviso} disabled={lejosDeProximaParada}></ActionButton>
          </View>
        </View>

        <View style={localstyles.espacio}/>

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

        <ModalInput
          visible={mostrarNotificarIrregularidad}
          text={'Ingrese un texto para notificar'}
          cancel={() => setMostrarNotificarIrregularidad(false)}
          confirm={notificarIrregularidad}        
        />
      </View>
    </>
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
  headerContainer: {
    marginTop: -720,
    padding: 0,
    marginHorizontal: 25,
    flex: 1,
    flexDirection: 'row',
  },
  botonHeader: {
    flex: 1,
    padding: 10
  },
  espacio: {
    flex: 10,
  },
});
