import React, { useEffect, useState } from 'react';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { StyleSheet } from 'react-native';
import { customMapStyle, GOOGLE_API_KEY } from '../constants';
import { getRegionForCoordinates } from '../utils/map.utils';
import { Recorrido } from '../domain/Recorrido';


export default function MapViewRecorrido({ recorrido }: { recorrido: Recorrido }) {
  const { pasajeros, escuela, esIda } = recorrido;
  const [currentPosition, setCurrentPosition] = useState<LatLng>();

  const pointsList: LatLng[] = [
    ...pasajeros.map((pasajero) => pasajero.coordenadas)
  ];

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      setCurrentPosition((await Location.getCurrentPositionAsync()).coords);
      // Location.watchPositionAsync({}, location => setCurrentPosition(location.coords))
    })();
  }, []);

  const getRegion = () => getRegionForCoordinates([...pointsList, escuela.coordenadas]);

  return (
    <MapView
      style={localstyles.map}
      customMapStyle={customMapStyle}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      region={getRegion()}
    >
      <Marker coordinate={escuela.coordenadas} title={escuela.nombre} image={require('../../assets/marker-school.png')}/>
      { currentPosition && <Marker coordinate={currentPosition} image={require('../../assets/marker-bus.png')}/> }

      { pasajeros.map((pasajero) => 
        <Marker key={pasajero.id} coordinate={pasajero.coordenadas} title={pasajero.domicilio} image={require('../../assets/marker-house.png')}/>
      )}

      {/* TODO: Considerar mejor el inicio y fin dependiendo de si es ida o vuelta. */}
      <MapViewDirections
        origin={esIda ? currentPosition : escuela.coordenadas}
        destination={esIda ? escuela.coordenadas : currentPosition}
        waypoints={pointsList}
        optimizeWaypoints={true}
        splitWaypoints={true}
        apikey={GOOGLE_API_KEY}
        strokeWidth={8}
        strokeColor='orange'
      />
    </MapView>
  );
}

const localstyles = StyleSheet.create({
  map: {
    height: '152%',
    width: '100%',
  },
});