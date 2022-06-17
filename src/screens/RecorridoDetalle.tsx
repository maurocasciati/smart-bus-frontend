import React, { useEffect } from 'react';
import * as Location from 'expo-location';
import { View, Text, StyleSheet } from 'react-native';
import { RecorridoDetalleProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import MapViewRecorrido from '../components/MapViewRecorrido';

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
            <Text style={localstyles.subtitle}>{ recorrido.escuela.nombre }</Text>
            <Text style={localstyles.subtitle}>{ recorrido.escuela.domicilio }</Text>
          </View>
          <View>
            <View style={{ height: 30, width: 100 }}>
              <SecondaryButton name='Editar' action={() => navigation.navigate('NotFound')}></SecondaryButton>
            </View>
            <Text style={localstyles.type}>{recorrido.esIda ? 'Ida' : 'Vuelta'}</Text>
            <Text style={localstyles.hour}>{recorrido.horario}</Text>
          </View>
        </View>
        <View style={localstyles.pasajerosContainer}>
          <Text style={localstyles.pasajerosText}>Cantidad de pasajeros: {recorrido.pasajeros.length}</Text>
          <View style={{ height: 30, width: 100 }}>
            <SecondaryButton name='Ver listado' action={() => navigation.navigate('NotFound')}></SecondaryButton>
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
    marginTop: -200,
    borderRadius: 20,
    elevation: 6,
    backgroundColor: '#fff',
    margin: 25,
    flex: 3,
  },
  recorridoContainer: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    flex: 8,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  pasajerosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    flex: 2,
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
