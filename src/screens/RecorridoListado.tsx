import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { AuthContext } from '../auth/AuthProvider';
import ErrorText from '../components/ErrorText';
import { RecorridoListadoProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { Recorrido } from '../domain/Recorrido';
import { RolUsuario } from '../domain/RolUsuario';
import { getListadoRecorridos } from '../services/recorrido.service';
import { styles } from '../styles/styles';
import { mapDateTimeStringToTime } from '../utils/date.utils';

export default function RecorridoListado({ navigation }: RecorridoListadoProps) {
  const [listadoRecorridos, setListadoRecorridos] = useState<Recorrido[]>([]);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token, rol } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let componentIsFocused = true;

      (async () => {
        try {
          const recorridos = await getListadoRecorridos(token);
          if (componentIsFocused && recorridos) {
            setListadoRecorridos(recorridos);
          }
        } catch(error) {
          setMensajeError(error as string);
        }
      })();

      return () => { componentIsFocused = false; };
    }, [])
  );

  const verDetalleRecorrido = (recorrido: Recorrido) => {
    rol?.valueOf() === RolUsuario.CHOFER
      ? navigation.navigate('RecorridoDetalle', { recorrido })
      : navigation.navigate('RecorridoDetalleTutor', { recorrido });
  };

  const renderItem = (recorrido: ListRenderItemInfo<Recorrido>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => verDetalleRecorrido(recorrido.item)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{recorrido.item.nombre}</Text>
          <Text style={styles.subtitle}>{recorrido.item.escuela?.nombre}</Text>
        </View>
        <View>
          <Text style={styles.type}>{recorrido.item.esRecorridoDeIda ? 'Ida' : 'Vuelta'}</Text>
          <Text style={styles.hour}>{mapDateTimeStringToTime(recorrido.item.horario)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList data={listadoRecorridos} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>

      <View style={styles.center}>
        { mensajeError && ErrorText(mensajeError) }
        { rol?.valueOf() === RolUsuario.CHOFER && 
          <PrimaryButton name={'Crear Recorrido'} action={() => navigation.navigate('RecorridoEdicion', { recorrido: null } )}/>
        }
      </View>
    </View>
  );
}
