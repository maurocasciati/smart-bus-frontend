import React, { useEffect, useState } from 'react';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { View, Text, Button } from 'react-native';
import { DetalleRecorridoProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import { GOOGLE_API_KEY } from '../constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

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
  const [inputMarker, setInputMarker] = useState<LatLng | null>(null);

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Pantalla detalle de Recorrido: {recorridoId}</Text>

      <GooglePlacesAutocomplete
        placeholder='Ingrese la dirección'
        minLength={4}
        fetchDetails={true}
        onPress={(data, details) => {
          if (details?.geometry?.location) {
            const { lat, lng } = details.geometry.location;
            setInputMarker({ latitude: lat, longitude: lng });
          }
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: 'es',
          components: 'country:ar',
        }}
        debounce={500}
        styles={{
          textInputContainer: {
            width: '90%',
          },
        }}
      />

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={mapRegion}
      >
        <Marker coordinate={marker1} title='Partida' />
        { inputMarker && 
          <>
            <Marker coordinate={inputMarker} title='Destino' />
            <MapViewDirections
              origin={marker1}
              destination={inputMarker}
              apikey={GOOGLE_API_KEY}
              strokeWidth={4}
              strokeColor="#111111"
            />
          </>
        }
      </MapView>

      
      <Button
        title="Volver a inicio"
        onPress={() => navigation.navigate('Inicio')} />
    </View>
  );
}
