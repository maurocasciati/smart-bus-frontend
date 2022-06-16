import React, { useEffect, useState } from 'react';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { View, Text, StyleSheet } from 'react-native';
import { DetalleRecorridoProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import { GOOGLE_API_KEY } from '../constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PrimaryButton from '../components/PrimaryButton';

export default function EditarPasajero({ route, navigation }: DetalleRecorridoProps) {
  const { recorrido } = route.params;

  const [inputMarker, setInputMarker] = useState<LatLng | null>(null);

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={localstyles.center}>
        <Text>Editar Pasajero</Text>
      </View>

      <View style={localstyles.center}>
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
      </View>

      <View style={localstyles.endButton}>
        <PrimaryButton name={'Guardar'} action={() => navigation.navigate('NotFound')}/>
      </View>
    </View>
  );
}

const localstyles = StyleSheet.create({
  center: {
    margin: 10,
    flex: 1,
    alignItems: 'center',
  },
  endButton: {
    flex: 1,
    alignItems: 'center',
  },
});
