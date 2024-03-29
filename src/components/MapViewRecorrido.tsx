import React, { useEffect, useState } from 'react';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { customMapStyle, GOOGLE_API_KEY } from '../constants';
import { getRegionForCoordinates } from '../utils/map.utils';
import { Recorrido } from '../domain/Recorrido';
import { styles } from '../styles/styles';


export default function MapViewRecorrido({ recorrido }: { recorrido: Recorrido }) {
  const { pasajeros, escuela, esRecorridoDeIda } = recorrido;
  const [currentPosition, setCurrentPosition] = useState<LatLng>();

  const pointsList: LatLng[] = [
    ...pasajeros.map((pasajero) => pasajero.domicilio.coordenadas)
  ];

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      setCurrentPosition((await Location.getCurrentPositionAsync()).coords);
    })();
  }, []);

  const mostrarDirecciones = () => escuela && pointsList.length > 0;
  const getRegion = () => escuela
    ? getRegionForCoordinates([...pointsList, escuela.direccion.coordenadas])
    : getRegionForCoordinates(pointsList);

  return (
    <MapView
      style={styles.map}
      customMapStyle={customMapStyle}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={false}
      region={getRegion()}
    >
      { escuela && <Marker coordinate={escuela.direccion.coordenadas} title={escuela.nombre} image={require('../../assets/marker-school.png')}/> }
      { currentPosition && <Marker coordinate={currentPosition} image={require('../../assets/marker-bus.png')}/> }

      { pasajeros.map((pasajero) => 
        <Marker key={pasajero.id} coordinate={pasajero.domicilio.coordenadas} title={pasajero.domicilio.domicilio} image={require('../../assets/marker-house.png')}/>
      )}

      { mostrarDirecciones() && <MapViewDirections
        origin={esRecorridoDeIda ? pointsList[0] : escuela?.direccion.coordenadas}
        destination={esRecorridoDeIda ? escuela?.direccion.coordenadas : pointsList[pointsList.length - 1]}
        waypoints={pointsList}
        optimizeWaypoints={false} // Poner en true cuando tengamos order automatico.
        splitWaypoints={true}
        apikey={GOOGLE_API_KEY}
        strokeWidth={2}
        strokeColor='orange'
      /> }

      { mostrarDirecciones() && <MapViewDirections
        origin={currentPosition}
        destination={esRecorridoDeIda ? pointsList[0] : escuela?.direccion.coordenadas}
        apikey={GOOGLE_API_KEY}
        strokeWidth={5}
        strokeColor='orange'
      /> }
    </MapView>
  );
}
