import React, { useEffect } from 'react';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { View, Text, StyleSheet } from 'react-native';
import { DetalleRecorridoProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import { customMapStyle, GOOGLE_API_KEY } from '../constants';
import PrimaryButton from '../components/PrimaryButton';
import { getRegionForCoordinates } from '../utils/map.utils';
import SecondaryButton from '../components/SecondaryButton';

export default function DetalleRecorrido({ route, navigation }: DetalleRecorridoProps) {
  const { recorrido } = route.params;

  const pointsList: LatLng[] = [
    recorrido.escuela.coordenadas,
    ...recorrido.pasajeros.map((pasajero) => pasajero.coordenadas)
  ];

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={localstyles.mapContainer}>
        <MapView
          style={localstyles.map}
          customMapStyle={customMapStyle}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={getRegionForCoordinates(pointsList)}
        >
          <Marker coordinate={recorrido.escuela.coordenadas} title={recorrido.escuela.nombre} />

          { recorrido.pasajeros.map((pasajero) => 
            <Marker key={pasajero.id} coordinate={pasajero.coordenadas} title={pasajero.domicilio} />
          )}

          <MapViewDirections
            origin={recorrido.escuela.coordenadas}
            destination={recorrido.pasajeros[1].coordenadas}
            apikey={GOOGLE_API_KEY}
            strokeWidth={10}
            strokeColor='darkorange'
          />
        </MapView>
      </View>

      <View style={localstyles.detailsContainer}>
        <View style={localstyles.recorridoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={localstyles.title}>{ recorrido.nombre }</Text>
            <Text style={localstyles.subtitle}>{ recorrido.escuela.nombre }</Text>
            <Text style={localstyles.subtitle}>{ recorrido.escuela.domicilio }</Text>
          </View>
          <View>
            <View style={{ height: 25, width: 100 }}>
              <SecondaryButton name='Editar' action={() => navigation.navigate('NotFound')}></SecondaryButton>
            </View>
            <Text style={localstyles.type}>{recorrido.esIda ? 'Ida' : 'Vuelta'}</Text>
            <Text style={localstyles.hour}>{recorrido.horario}</Text>
          </View>
        </View>
        <View style={localstyles.pasajerosContainer}>
          <Text style={localstyles.pasajerosText}>Cantidad de pasajeros: {recorrido.pasajeros.length}</Text>
          <View style={{ height: 25, width: 100 }}>
            <SecondaryButton name='Ver listado' action={() => navigation.navigate('NotFound')}></SecondaryButton>
          </View>
        </View>
        <View style={localstyles.footerButton}>
          <PrimaryButton name={'INICIAR'} action={() => navigation.navigate('NotFound')}/>
        </View>
      </View>
    </View>
  );
}

const localstyles = StyleSheet.create({
  mapContainer: {
    flex: 7,
  },
  map: {
    height: '154%',
    width: '100%',
  },
  detailsContainer: {
    borderRadius: 20,
    elevation: 6,
    backgroundColor: '#fff',
    margin: 25,
    flex: 3,
  },
  recorridoContainer: {
    flexDirection: 'row',
    margin: 10,
    flex: 8,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  pasajerosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    flex: 4,
  },
  title: {
    fontSize: 18,
    alignContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    alignContent: 'center',
  },
  pasajerosText: {
    fontSize: 18,
    flex: 3,
  },
  footerButton: {
    alignItems: 'center',
    elevation: 6,
  },
  type: {
    fontSize: 12,
    textAlign: 'center',
  },
  hour: {
    fontSize: 16,
    textAlign: 'center',
  },
});
