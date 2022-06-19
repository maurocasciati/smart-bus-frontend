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
        onPress={() => console.log('hola')
        // navigation.navigate('PasajeroEdicion', { recorrido })
        }
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {pasajeroItem.item.nombre + ' ' + pasajeroItem.item.apellido }
          </Text>
          <Text style={styles.subtitle}>
            {pasajeroItem.item.piso_dpto ? pasajeroItem.item.domicilio + ' ' + pasajeroItem.item.piso_dpto : pasajeroItem.item.domicilio}
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
        <FlatList data={recorrido.pasajeros} renderItem={renderItem} keyExtractor={item => item.id} />
      </SafeAreaView>

      <View style={styles.center}>
        <PrimaryButton name={'Volver'} action={() => navigation.navigate('RecorridoDetalle', { recorrido })}/>
      </View>
    </View>
  );
}
