import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../auth/AuthProvider';
import ErrorText from '../../components/ErrorText';
import { HistorialRecorridoDetalleProps } from '../../components/Navigation';
import PrimaryButton from '../../components/PrimaryButton';
import { HistorialRecorrido } from '../../domain/HistorialRecorrido';
import { IrregularidadHistorialRecorrido } from '../../domain/IrregularidadHistorialRecorrido';
import { Parada } from '../../domain/Parada';
import { ParadaHistorialRecorrido } from '../../domain/ParadaHistorialRecorrido';
import { RolUsuario } from '../../domain/RolUsuario';
import { getHistorialRecorridos } from '../../services/historial.service';
import { styles } from '../../styles/styles';
import { mapDateTimeStringToDate, mapDateTimeStringToTime } from '../../utils/date.utils';

export default function HistorialRecorridoDetalle({ route, navigation }: HistorialRecorridoDetalleProps) {
  const { historialRecorrido } = route.params;
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token, rol } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let componentIsFocused = true;
      return () => { componentIsFocused = false; };
    }, [])
  );

  const verDetalleParada = (item : ParadaHistorialRecorrido) => null;

  const renderItem = (paradaItemContainer: ListRenderItemInfo<ParadaHistorialRecorrido>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => verDetalleParada(paradaItemContainer.item)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{paradaItemContainer.item.nombre}</Text>
          <Text style={styles.subtitle}>{paradaItemContainer.item.exito ? 'El pasajero llego con exito' : 'El pasajero no llego con exito'}</Text>
        </View>
        <View>
          <Text style={styles.hour}>{paradaItemContainer.item.fechaParada}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderItemIrregularidad = (paradaItemContainer: ListRenderItemInfo<IrregularidadHistorialRecorrido>) => (
    <View style={styles.line}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{paradaItemContainer.item.descripcion}</Text>
      </View>
      <View>
        <Text style={styles.hour}>{paradaItemContainer.item.fechaIrregularidad}</Text>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <View style={styles.detallesRecorrido}>
          <Text style={styles.subtitle}>Recorrido:</Text>
          <Text style={styles.title}>{historialRecorrido.recorrido?.nombre}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Fecha:</Text>
          <Text style={styles.title}>{mapDateTimeStringToDate(historialRecorrido.fechaInicio)}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Hora Inicio:</Text>
          <Text style={styles.title}>{mapDateTimeStringToTime(historialRecorrido.fechaInicio)}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Hora Fin:</Text>
          <Text style={styles.title}>{mapDateTimeStringToTime(historialRecorrido.fechaFinalizacion)}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Paradas:</Text>
        </View>
        <FlatList data={historialRecorrido.paradas} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
        <Text style={styles.subtitle}></Text>
        <View style={styles.detallesRecorridoIrregularidades}>
          <Text style={styles.subtitle}>Irregularidades:</Text>
        </View>
        <FlatList data={historialRecorrido.irregularidades} renderItem={renderItemIrregularidad} keyExtractor={item => item.id.toString()} />
        
      </SafeAreaView>
    </View>
  );
}
