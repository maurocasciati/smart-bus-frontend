import React, { useEffect } from 'react';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { StyleSheet } from 'react-native';
import { customMapStyle, GOOGLE_API_KEY } from '../constants';
import { getRegionForCoordinates } from '../utils/map.utils';
import { Recorrido } from '../domain/Recorrido';


export default function MapViewRecorrido({ recorrido }: { recorrido: Recorrido }) {
  const { pasajeros, escuela, esIda } = recorrido;

  const pointsList: LatLng[] = [
    escuela.coordenadas,
    ...pasajeros.map((pasajero) => pasajero.coordenadas)
  ];

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  return (
    <MapView
      style={localstyles.map}
      customMapStyle={customMapStyle}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      region={getRegionForCoordinates(pointsList)}
    >
      <Marker coordinate={escuela.coordenadas} title={escuela.nombre} image={require('../../assets/marker-school.png')}/>
      
      { esIda ?
        <MapViewDirections
          key={'e;' + pasajeros[0].id}
          origin={escuela.coordenadas}
          destination={pasajeros[0].coordenadas}
          apikey={GOOGLE_API_KEY}
          strokeWidth={8}
          strokeColor='orange'
        />
        :
        <MapViewDirections
          key={pasajeros[pasajeros.length].id + ';e'}
          origin={pasajeros[0].coordenadas}
          destination={escuela.coordenadas}
          apikey={GOOGLE_API_KEY}
          strokeWidth={8}
          strokeColor='orange'
        />
      }

      { pasajeros.map((pasajero, index) => {
        if (index === 0) 
          return <Marker key={pasajero.id} coordinate={pasajero.coordenadas} title={pasajero.domicilio} image={require('../../assets/marker-house.png')}/>;

        const pasajeroAnterior = pasajeros[index - 1];
          
        return (<>
          <Marker key={pasajero.id} coordinate={pasajero.coordenadas} title={pasajero.domicilio} image={require('../../assets/marker-house.png')}/>
          <MapViewDirections
            key={pasajeroAnterior.id + ';' + pasajero.id}
            origin={pasajeroAnterior.coordenadas}
            destination={pasajero.coordenadas}
            apikey={GOOGLE_API_KEY}
            strokeWidth={8}
            strokeColor='orange'
          />
        </>);
      })}
    </MapView>
  );
}

const localstyles = StyleSheet.create({
  map: {
    height: '152%',
    width: '100%',
  },
});