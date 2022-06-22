import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, ListRenderItemInfo, TouchableOpacity, FlatList, Alert } from 'react-native';
import { EstadoDeCuentaProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { EstadoDeCuenta, EstadoDeCuentaTexto } from '../domain/EstadoDeCuenta';
import { mockEstadoDeCuenta } from '../mocks';
import { styles } from '../styles/styles';

export default function VerEstadoDeCuenta({ route, navigation }: EstadoDeCuentaProps) {
  const { pasajero, recorrido } = route.params;

  const [estadoDeCuenta, setEstadoDeCuenta] = useState<EstadoDeCuenta>(mockEstadoDeCuenta);

  const guardarCambios = () => {
    console.log(estadoDeCuenta);
    Alert.alert('', `El estado de cuenta del pasajero ${pasajero.nombre} ${pasajero.apellido} del recorrido ${recorrido.nombre} fue guardado con éxito`);
    navigation.navigate('PasajeroEdicion', { dataRecorrido: null, pasajero, recorrido });
  };

  const renderItem = (key: ListRenderItemInfo<string>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => setEstadoDeCuenta({
          ...estadoDeCuenta,
          [key.item as keyof EstadoDeCuenta]: !estadoDeCuenta[key.item as keyof EstadoDeCuenta],
        })}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            { EstadoDeCuentaTexto[key.item as keyof EstadoDeCuenta] }
          </Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Checkbox 
            value={estadoDeCuenta[key.item as keyof EstadoDeCuenta]}
            color={'orange'}/>
        </View>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList data={Object.keys(EstadoDeCuentaTexto) as string[]} renderItem={renderItem} />
      </SafeAreaView>

      <View style={styles.footer}>
        <PrimaryButton name={'Guardar cambios'} action={guardarCambios}/>
      </View>
    </View>
  );
}
