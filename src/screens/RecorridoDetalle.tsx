import React, { useCallback, useContext, useState } from 'react';
import * as Location from 'expo-location';
import { View, Text, StyleSheet } from 'react-native';
import { RecorridoDetalleProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import MapViewRecorrido from '../components/MapViewRecorrido';
import { mapDateTimeStringToTime } from '../utils/date.utils';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { Recorrido } from '../domain/Recorrido';
import { AuthContext } from '../auth/AuthProvider';
import { getRecorridoOriginal } from '../services/recorrido.service';
import ErrorText from '../components/ErrorText';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../components/ActionButton';

export default function RecorridoDetalle({ route, navigation }: RecorridoDetalleProps) {
  const { recorrido } = route.params;

  const [recorridoFetched, setRecorridoFetched] = useState<Recorrido | undefined>(undefined);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  
  const { token } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let componentIsFocused = true;

      (async () => {
        await Location.requestForegroundPermissionsAsync();
        try {
          const recorridoFetchedResponse = await getRecorridoOriginal(token, recorrido.id);
          if (componentIsFocused && recorridoFetchedResponse) {
            setRecorridoFetched(recorridoFetchedResponse);
          }
        } catch(error) {
          setMensajeError(error as string);
        }
      })();

      return () => { componentIsFocused = false; };
    }, [])
  );

  const tieneEscuela = !!recorridoFetched?.escuela;
  const tienePasajeros = !!recorridoFetched?.pasajeros && recorridoFetched.pasajeros.length > 0;

  return (recorridoFetched ?
    <View style={styles.container}>
      <View>
        <MapViewRecorrido recorrido={recorridoFetched} />
      </View>

      <View style={localstyles.headerContainer}>
        <View style={localstyles.botonHeader}>
          <ActionButton name='Ver historial' action={() => navigation.navigate('HistorialRecorridoListado', { recorrido: recorridoFetched })} secondary={true}></ActionButton>
        </View>
        <View style={localstyles.botonHeader}/>
        <View style={localstyles.botonHeader}/>
      </View>

      <View style={localstyles.espacio}/>

      { tieneEscuela && tienePasajeros &&
      <View style={localstyles.detailsContainer}>
        <View style={localstyles.recorridoFetchedContainer}>
          <View style={{ flex: 1 }}>
            <Text style={localstyles.title}>{ recorridoFetched.nombre }</Text>
          </View>
          <View style={{ paddingHorizontal: 20, alignContent: 'center' }}>
            <Text style={localstyles.type}>{recorridoFetched.esRecorridoDeIda ? 'Ida' : 'Vuelta'}</Text>
            <Text style={localstyles.hour}>{mapDateTimeStringToTime(recorridoFetched.horario)}</Text>
          </View>
          <View style={localstyles.columns}>
            <View style={localstyles.botonContainer}>
              <SecondaryButton name='Editar' action={() => navigation.navigate('RecorridoEdicion', { recorrido: recorridoFetched } )}></SecondaryButton>
            </View>
          </View>
        </View>
        <View style={localstyles.escuelaContainer}>
          <View style={{ flex: 1 }}>
            <Text style={localstyles.title}>{ recorridoFetched.escuela?.nombre }</Text>
            <Text style={localstyles.subtitle}>{ recorridoFetched.escuela?.direccion.domicilio }</Text>
          </View>
          <View style={localstyles.columns}>
            <View style={localstyles.botonContainer}>
              <SecondaryButton name='Ver escuela' action={() => navigation.navigate('EscuelaEdicion', { recorrido: recorridoFetched, dataRecorrido: null, escuela: recorridoFetched.escuela } )}></SecondaryButton>
            </View>
          </View>
        </View>
        <View style={localstyles.pasajerosContainer}>
          <Text style={localstyles.pasajerosText}>Cantidad de pasajeros: {recorridoFetched.pasajeros.length}</Text>
          <View style={localstyles.botonContainer}>
            <SecondaryButton name='Ver listado' action={() => navigation.navigate('PasajeroListado', { recorrido: recorridoFetched })}></SecondaryButton>
          </View>
        </View>
        <View style={localstyles.footerButton}>
          { mensajeError && ErrorText(mensajeError) }
          <PrimaryButton name={'INICIAR'} action={() => navigation.navigate('RecorridoEnCurso', { recorrido: recorridoFetched })}/>
        </View>
      </View>
      }

      <ModalConfirmacion
        visible={!tieneEscuela || !tienePasajeros}
        text={`El recorrido ${recorridoFetched?.nombre} está incompleto. ¿Desea editarlo para completarlo ahora?`}
        cancel={() => navigation.navigate('RecorridoListado')}
        confirm={() => navigation.navigate('RecorridoEdicion', { recorrido: recorridoFetched || recorrido } )}
      />
    </View>
    : <></>
  );
}

const localstyles = StyleSheet.create({
  detailsContainer: {
    marginTop: -250,
    borderRadius: 20,
    elevation: 6,
    backgroundColor: '#fff',
    margin: 25,
    flex: 4,
  },
  recorridoFetchedContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 10,
    flex: 4,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  escuelaContainer: {
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 10,
    flex: 7,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  pasajerosContainer: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingHorizontal: 10,
    flex: 3,
  },
  botonContainer: {
    height: 40,
    width: 100,
  },
  columns: {
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
  },
  pasajerosText: {
    marginTop: 5,
    fontSize: 16,
    flex: 3,
  },
  footerButton: {
    marginBottom: -10,
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
  headerContainer: {
    marginTop: -720,
    padding: 0,
    marginHorizontal: 25,
    flex: 1,
    flexDirection: 'row',
  },
  botonHeader: {
    flex: 1,
    padding: 10
  },
  espacio: {
    flex: 11,
  },
});
