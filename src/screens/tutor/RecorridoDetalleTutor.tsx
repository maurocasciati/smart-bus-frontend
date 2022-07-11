import React from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { RecorridoDetalleProps } from '../../components/Navigation';
import PrimaryButton from '../../components/PrimaryButton';
import { Pasajero } from '../../domain/Pasajero';
import { styles } from '../../styles/styles';
import { mapDateTimeStringToTime } from '../../utils/date.utils';

export default function RecorridoDetalleTutor({ route, navigation }: RecorridoDetalleProps) {
  const { recorrido } = route.params;

  const renderItem = (pasajero: ListRenderItemInfo<Pasajero>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.itemsmall}
        onPress={() => navigation.navigate('PasajeroDetalleTutor', {
          pasajero: pasajero.item, recorrido
        })}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{pasajero.item.nombre} {pasajero.item.apellido}</Text>
          <Text style={styles.subtitle}>{pasajero.item.domicilio.domicilio}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <View style={styles.detallesRecorrido}>
          <Text style={styles.subtitle}>Escuela:</Text>
          <Text style={styles.title}>{recorrido.escuela?.nombre}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Dirección:</Text>
          <Text style={styles.title}>{recorrido.escuela?.direccion.domicilio}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Horario:</Text>
          <Text style={styles.title}>{mapDateTimeStringToTime(recorrido.horario)} {recorrido.esRecorridoDeIda ? '(Ida)' : '(Vuelta)'}</Text>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.subtitle}>Pasajeros:</Text>
        </View>
        <FlatList data={recorrido.pasajeros} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>

      <View style={styles.center}>
        <PrimaryButton name={'Ver historial del recorrido'} action={() => null} secondary= {true}/>
        {/* TODO: Ocultar si el recorrido no esta inciado */}
        <PrimaryButton name={'Ver recorrido en curso'} action={() => null}/>
      </View>
    </View>
  );
}
