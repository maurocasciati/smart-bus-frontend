import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RecorridoEnCursoProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Parada } from '../domain/Parada';
import { getFocusedRegion } from '../utils/map.utils';
import { customMapStyle, GOOGLE_API_KEY } from '../constants';
import MapViewDirections from 'react-native-maps-directions';
import ActionButton from '../components/ActionButton';
import SecondaryButton from '../components/SecondaryButton';

export default function RecorridoEnCurso({ route, navigation }: RecorridoEnCursoProps) {
  const { recorrido } = route.params;
  const { pasajeros, escuela, esIda } = recorrido;
  const [currentPosition, setCurrentPosition] = useState<LatLng>({} as LatLng);
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [waypoints, setWaypoints] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toggleFocus, setToggleFocus] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      Location.watchPositionAsync({}, location => setCurrentPosition(location.coords));

      console.log(escuela);

      setParadas([
        ...esIda ? [] : [escuela],
        ...pasajeros,
        ...esIda ? [escuela] : [],
      ]);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    setWaypoints(paradas.map((pasajero) => pasajero.coordenadas));
  }, [paradas]);

  const esUltimaParada = (): boolean => paradas.length > 1;
  const removerParada = (): void => setParadas(paradas.slice(1));

  const getRegion = (): Region => toggleFocus ? getFocusedRegion(currentPosition) : getFocusedRegion(paradas[0].coordenadas);

  const renderMap = () => {
    return loading ? null : (
      <MapView
        style={styles.map}
        customMapStyle={customMapStyle}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={getRegion()}
      >
        { paradas.map((parada) => 
          <Marker
            key={parada.id + parada.esEscuela}
            coordinate={parada.coordenadas}
            title={parada.esEscuela ? parada.nombre : parada.domicilio}
            image={parada.esEscuela ? require('../../assets/marker-school.png') : require('../../assets/marker-house.png')}/>
        )}

        <MapViewDirections
          origin={currentPosition}
          destination={paradas[0].coordenadas}
          apikey={GOOGLE_API_KEY}
          strokeWidth={5}
          strokeColor='orange'
        />

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

  return loading ? null : (
    <View style={styles.container}>
      { renderMap() }

      <View style={localstyles.detailsContainer}>
        <View style={localstyles.recorridoContainer}>
          { esUltimaParada()?
            <>
              <View style={{ flex: 1, margin: 5 }}>
                <ActionButton name='No Sube' action={removerParada}></ActionButton>
              </View>
              <View style={{ flex: 3, margin: 5 }}>
                <ActionButton name='Sube' action={removerParada}></ActionButton>
              </View>
            </> :
            <View style={{ flex: 1, margin: 5 }}>
              <ActionButton name={'FINALIZAR'} action={() => navigation.navigate('DetalleRecorrido', { recorrido })}/>
            </View>
          }
        </View>
        <TouchableOpacity
          style={localstyles.pasajerosContainer}
          onPress={() => setToggleFocus(!toggleFocus)}
        >
          <Text style={localstyles.pasajerosText}>Siguiente: {paradas[0].domicilio}</Text>
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
