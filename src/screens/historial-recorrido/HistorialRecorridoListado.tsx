import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../auth/AuthProvider';
import ErrorText from '../../components/ErrorText';
import { HistorialRecorridoListadoProps } from '../../components/Navigation';
import PrimaryButton from '../../components/PrimaryButton';
import { HistorialRecorrido } from '../../domain/HistorialRecorrido';
import { RolUsuario } from '../../domain/RolUsuario';
import { getHistorialRecorridos } from '../../services/historial.service';
import { styles } from '../../styles/styles';

export default function HistorialRecorridoListado({ navigation }: HistorialRecorridoListadoProps) {
  const [historialRecorridos, setHistorialRecorridos] = useState<HistorialRecorrido[]>([]);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token, rol } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let componentIsFocused = true;

      (async () => {
        try {
          const historial = await getHistorialRecorridos(token);
          if (componentIsFocused && historial) {
            setHistorialRecorridos(historial);
          }
        } catch(error) {
          setMensajeError(error as string);
        }
      })();

      return () => { componentIsFocused = false; };
    }, [])
  );

  const verDetalleHistorialRecorrido = (historialRecorrido: HistorialRecorrido) => {
    rol?.valueOf() === RolUsuario.CHOFER ? navigation.navigate('HistorialRecorridoDetalle', { historialRecorrido })
      : rol?.valueOf() === RolUsuario.TUTOR ? navigation.navigate('HistorialRecorridoDetalleTutor', { historialRecorrido })
        : null;
  };

  const renderItem = (historialItemContainer: ListRenderItemInfo<HistorialRecorrido>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => verDetalleHistorialRecorrido(historialItemContainer.item)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{historialItemContainer.item.recorrido.nombre}</Text>
          <Text style={styles.subtitle}>{historialItemContainer.item.recorrido.escuela?.nombre}</Text>
        </View>
        <View>
          <Text style={styles.hour}>{historialItemContainer.item.fechaInicio}</Text>
          <Text style={styles.hour}>{historialItemContainer.item.fechaFinalizacion}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList data={historialRecorridos} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
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
