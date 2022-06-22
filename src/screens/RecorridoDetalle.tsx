import React, { useEffect } from 'react';
import * as Location from 'expo-location';
import { View, Text, StyleSheet } from 'react-native';
import { RecorridoDetalleProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import MapViewRecorrido from '../components/MapViewRecorrido';
import { mapDateTimeStringToTime } from '../utils/date.utils';

export default function RecorridoDetalle({ route, navigation }: RecorridoDetalleProps) {
  const { recorrido } = route.params;

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <MapViewRecorrido recorrido={recorrido} />
      </View>

      <View style={localstyles.detailsContainer}>
        <View style={localstyles.recorridoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={localstyles.title}>{ recorrido.nombre }</Text>
          </View>
          <View style={{ paddingHorizontal: 20, alignContent: 'center' }}>
            <Text style={localstyles.type}>{recorrido.esRecorridoDeIda ? 'Ida' : 'Vuelta'}</Text>
            <Text style={localstyles.hour}>{mapDateTimeStringToTime(recorrido.horario)}</Text>
          </View>
          <View>
            <View style={localstyles.botonContainer}>
              <SecondaryButton name='Editar' action={() => navigation.navigate('RecorridoEdicion', { recorrido } )}></SecondaryButton>
            </View>
          </View>
        </View>
        <View style={localstyles.escuelaContainer}>
          <View style={{ flex: 1 }}>
            <Text style={localstyles.title}>{ recorrido.escuela.nombre }</Text>
            <Text style={localstyles.subtitle}>{ recorrido.escuela.direccion.domicilio }</Text>
          </View>
          <View>
            <View style={localstyles.botonContainer}>
              <SecondaryButton name='Ver escuela' action={() => navigation.navigate('EscuelaEdicion', { recorrido, dataRecorrido: null, escuela: recorrido.escuela } )}></SecondaryButton>
            </View>
          </View>
        </View>
        <View style={localstyles.pasajerosContainer}>
          <Text style={localstyles.pasajerosText}>Cantidad de pasajeros: {recorrido.pasajeros.length}</Text>
          <View style={localstyles.botonContainer}>
            <SecondaryButton name='Ver listado' action={() => navigation.navigate('PasajeroListado', { recorrido })}></SecondaryButton>
          </View>
        </View>
        <View style={localstyles.footerButton}>
          <PrimaryButton name={'INICIAR'} action={() => navigation.navigate('RecorridoEnCurso', { recorrido })}/>
        </View>
      </View>
    </View>
  );
}

const localstyles = StyleSheet.create({
  detailsContainer: {
    marginTop: -250,
    borderRadius: 20,
    elevation: 6,
    backgroundColor: '#fff',
    margin: 25,
    flex: 1,
  },
  recorridoContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 5,
    flex: 4,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  escuelaContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flex: 4,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  pasajerosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingHorizontal: 10,
    flex: 4,
  },
  botonContainer: {
    height: 40,
    width: 100,
  },
  title: {
    fontSize: 16,
    alignContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    alignContent: 'center',
  },
  pasajerosText: {
    marginTop: -5,
    fontSize: 16,
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
