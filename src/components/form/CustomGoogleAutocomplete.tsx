import React from 'react';
import { Control, Controller, FieldErrors, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { View, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { LatLng } from 'react-native-maps';
import { GOOGLE_API_KEY } from '../../constants';

type CustomInputProps = {
  control: Control<any>;
  name: string;
  rules: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  placeholder: string
  errors: FieldErrors<FieldValues>
};

export default function CustomGoogleAutocomplete({control, name, rules, placeholder, errors} : CustomInputProps & {ocultarTexto?: boolean}) {
  return (
    <>
      <View>
        {errors[name] && <Text>{errors[name]?.message}</Text>}
      </View>
      <View style={localstyles.inputView}>
        <Controller 
          control={control}
          name={name}
          rules={rules}
          render={({ field: {onChange}}) => (
            <GooglePlacesAutocomplete
              placeholder={placeholder}
              minLength={4}
              fetchDetails={true}
              onPress={(data, details) => {
                if (details?.geometry?.location) {
                  const { lat, lng } = details.geometry.location;
                  onChange({
                    domicilio: data.description,
                    coordenadas: { latitude: lat, longitude: lng } as LatLng,
                  });
                }
              }}
              query={{
                key: GOOGLE_API_KEY,
                language: 'es',
                components: 'country:ar',
              }}
              debounce={500}
              styles={mapstyles}
            />
          )}
        />
      </View>
    </>
  );
}

const mapstyles = StyleSheet.create({
  textInput: {
    borderRadius: 30,
  },
  textInputContainer: {
    paddingHorizontal: 20,
  },
  listView: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
  },
});

const localstyles = StyleSheet.create({
  inputView: {
    borderRadius: 30,
    position: 'relative',
    backgroundColor: '#fff',
    width: '70%',
    height: 200,
    marginBottom: 20,
    elevation: 4,
  },
});
