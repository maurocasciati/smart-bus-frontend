import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../auth/AuthProvider';
import ErrorText from '../../components/ErrorText';
import { HistorialRecorridoDetalleProps } from '../../components/Navigation';
import PrimaryButton from '../../components/PrimaryButton';
import { HistorialRecorrido } from '../../domain/HistorialRecorrido';
import { Parada } from '../../domain/Parada';
import { RolUsuario } from '../../domain/RolUsuario';
import { getHistorialRecorridos } from '../../services/historial.service';
import { styles } from '../../styles/styles';

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

  const verDetalleParada = (item : Parada) => null;

  const renderItem = (paradaItemContainer: ListRenderItemInfo<Parada>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => verDetalleParada(paradaItemContainer.item)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{paradaItemContainer.item.nombre}</Text>
          <Text style={styles.subtitle}>{paradaItemContainer.item.exito ? 'El pasajero llego con exito' : paradaItemContainer.item.eventualidad}</Text>
        </View>
        <View>
          <Text style={styles.hour}>{paradaItemContainer.item.fechaParada}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <View style={styles.detallesRecorrido}>
          <Text style={styles.subtitle}>Recorrido:</Text>
          <Text style={styles.title}>{historialRecorrido.recorrido?.nombre}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Fecha Inicio:</Text>
          <Text style={styles.title}>{historialRecorrido.fechaInicio}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Fecha Fin:</Text>
          <Text style={styles.title}>{historialRecorrido.fechaFinalizacion}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Paradas:</Text>
        </View>
        <FlatList data={historialRecorrido.paradas} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>
    </View>
  );
}
