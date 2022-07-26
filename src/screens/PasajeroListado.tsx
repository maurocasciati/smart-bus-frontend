import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { AuthContext } from '../auth/AuthProvider';
import ErrorText from '../components/ErrorText';
import { PasajeroListadoProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { Pasajero } from '../domain/Pasajero';
import { getRecorridoOriginal } from '../services/recorrido.service';
import { styles } from '../styles/styles';

export default function PasajeroListado({ route, navigation }: PasajeroListadoProps) {
  const { recorrido } = route.params;

  const [listadoPasajeros, setListadoPasajeros] = useState<Pasajero[]>([]);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  
  const { token } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let componentIsFocused = true;

      (async () => {
        try {
          const recorridoResponse = await getRecorridoOriginal(token, recorrido.id);
          if (componentIsFocused && recorridoResponse) {
            setListadoPasajeros(recorridoResponse.pasajeros);
          }
        } catch(error) {
          setMensajeError(error as string);
        }
      })();

      return () => { componentIsFocused = false; };
    }, [])
  );

  const renderItem = (pasajeroItem: ListRenderItemInfo<Pasajero>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => 
          navigation.navigate('PasajeroEdicion', { dataRecorrido: null, pasajero: pasajeroItem.item, recorrido: recorrido })
        }
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {pasajeroItem.item.nombre + ' ' + pasajeroItem.item.apellido }
          </Text>
          <Text style={styles.subtitle}>
            {pasajeroItem.item.pisoDepartamento ? pasajeroItem.item.domicilio.domicilio + ' ' + pasajeroItem.item.pisoDepartamento : pasajeroItem.item.domicilio.domicilio}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList data={listadoPasajeros} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>

      <View style={styles.center}>
        { mensajeError && ErrorText(mensajeError) }
        <PrimaryButton name={'Ordenar paradas'} action={() => navigation.navigate('PasajeroOrden', { recorrido })}/>
      </View>
    </View>
  );
}
