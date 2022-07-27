import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../auth/AuthProvider';
import ErrorText from '../../components/ErrorText';
import { HistorialRecorridoListadoProps } from '../../components/Navigation';
import { HistorialRecorrido } from '../../domain/HistorialRecorrido';
import { getHistorialRecorridos } from '../../services/historial.service';
import { styles } from '../../styles/styles';
import { mapDateTimeStringToDate, mapDateTimeStringToTime } from '../../utils/date.utils';

export default function HistorialRecorridoListado({ route, navigation }: HistorialRecorridoListadoProps) {
  const { recorrido } = route.params;

  const [historialRecorridos, setHistorialRecorridos] = useState<HistorialRecorrido[]>([]);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let componentIsFocused = true;

      (async () => {
        try {
          const historial = await getHistorialRecorridos(token, recorrido.id);
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

  const verDetalleHistorialRecorrido = (historialRecorrido: HistorialRecorrido) =>
    navigation.navigate('HistorialRecorridoDetalle', { historialRecorrido, recorrido });

  const renderItem = (historialItemContainer: ListRenderItemInfo<HistorialRecorrido>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => verDetalleHistorialRecorrido(historialItemContainer.item)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{historialItemContainer.item.recorrido.nombre}</Text>
          <Text style={styles.subtitle}>{historialItemContainer.item.recorrido.escuela?.nombre}</Text>
          { historialItemContainer.item.interrumpido && 
            <Text style={{ ...styles.subtitle, color: 'darkorange' }}>Este recorrido fue interrumpido.</Text>
          }
        </View>
        <View>
          <Text style={styles.hour}>{mapDateTimeStringToDate(historialItemContainer.item.fechaInicio)}</Text>
          <Text style={styles.subtitle}>Inicio: {mapDateTimeStringToTime(historialItemContainer.item.fechaInicio)}</Text>
          <Text style={styles.subtitle}>Fin: {mapDateTimeStringToTime(historialItemContainer.item.fechaFinalizacion)}</Text>
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
      </View>
    </View>
  );
}
