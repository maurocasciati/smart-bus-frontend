import React from 'react';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { PasajeroListadoProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { Pasajero } from '../domain/Pasajero';
import { styles } from '../styles/styles';

export default function PasajeroListado({ route, navigation }: PasajeroListadoProps) {
  const { recorrido } = route.params;

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
        {/* TODO: Mostrar de este lado los botones para cambiar el orden del listado de pasajeros
      <View>  
        <Text style={localstyles.type}>{recorrido.item.esIda ? 'Ida' : 'Vuelta'}</Text>
        <Text style={localstyles.hour}>{recorrido.item.horario}</Text>
      </View> */}
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList data={recorrido.pasajeros} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>

      <View style={styles.center}>
        <PrimaryButton name={'Volver'} action={() => navigation.navigate('RecorridoDetalle', { recorrido })}/>
      </View>
    </View>
  );
}
