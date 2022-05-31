import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { View, Text, Button } from 'react-native';
import { DetalleRecorridoProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import { GOOGLE_API_KEY } from '../constants';

export default function DetalleRecorrido({ route, navigation }: DetalleRecorridoProps) {
  const { recorridoId } = route.params;

  const [mapRegion, setmapRegion] = useState({
    latitude: -34.618208,
    longitude: -58.444939,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0121,
  });
  const [marker1, setMarker1] = useState({
    latitude: -34.614310,
    longitude: -58.444872,
  });
  const [marker2, setMarker2] = useState({
    latitude: -34.616318,
    longitude: -58.438910,
  });

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Pantalla detalle de Recorrido: {recorridoId}</Text>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={mapRegion}
      >
        <Marker coordinate={marker1} title='From' />
        <Marker coordinate={marker2} title='To' />

        <MapViewDirections
          origin={marker2}
          destination={marker1}
          apikey={GOOGLE_API_KEY}
          strokeWidth={4}
          strokeColor="#111111"
        />
      </MapView>

      
      <Button
        title="Volver a inicio"
        onPress={() => navigation.navigate('Inicio')} />
    </View>
  );
}
