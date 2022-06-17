import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { PasajeroListadoProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { Pasajero } from '../domain/Pasajero';

import { styles } from '../styles/styles';

export default function PasajeroListado({ route, navigation }: PasajeroListadoProps) {
  const { recorrido } = route.params;


  const renderItem = (pasajeroItem: ListRenderItemInfo<Pasajero>) => (
    <TouchableOpacity
      style={localstyles.item}
      onPress={() => console.log('hola')
        // navigation.navigate('PasajeroEdicion', { recorrido })
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={localstyles.title}>
          {pasajeroItem.item.nombre + ' ' + pasajeroItem.item.apellido }
        </Text>
        <Text style={localstyles.subtitle}>
          {pasajeroItem.item.pido_dpto ? pasajeroItem.item.domicilio + ' ' + pasajeroItem.item.pido_dpto : pasajeroItem.item.domicilio}
        </Text>
      </View>
      {/* TODO: Mostrar de este lado los botones para cambiar el orden del listado de pasajeros
      <View>  
        <Text style={localstyles.type}>{recorrido.item.esIda ? 'Ida' : 'Vuelta'}</Text>
        <Text style={localstyles.hour}>{recorrido.item.horario}</Text>
      </View> */}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={localstyles.list}>
        <FlatList data={recorrido.pasajeros} renderItem={renderItem} keyExtractor={item => item.id} />
      </SafeAreaView>

      <View style={styles.center}>
        <PrimaryButton name={'Volver'} action={() => navigation.navigate('RecorridoDetalle', { recorrido })}/>
      </View>
    </View>
  );
}

const localstyles = StyleSheet.create({
  list: {
    flex: 1,
    margin: 20,
    borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    alignContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    alignContent: 'center',
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