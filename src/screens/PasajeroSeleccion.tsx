import React, { useCallback, useContext, useState } from 'react';
import { FlatList, SafeAreaView, View, Text, ListRenderItemInfo, TouchableOpacity, TextInput, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { PasajeroSeleccionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import ErrorText from '../components/ErrorText';
import { Pasajero } from '../domain/Pasajero';
import { AuthContext } from '../auth/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';
import { getListadoPasajeros } from '../services/pasajero.service';
import { postRecorrido, putRecorrido } from '../services/recorrido.service';

export default function PasajeroSeleccion({ route, navigation }: PasajeroSeleccionProps) {
  const { dataRecorrido, recorrido } = route.params;
  const [idPasajeros, setIdPasajeros] = useState<number[]>(recorrido?.pasajeros?.map(p => p.id) || []);
  const [listadoPasajeros, setListadoPasajeros] = useState<Pasajero[]>([]);
  const [listadoPasajerosFiltrados, setListadoPasajerosFiltrados] = useState<Pasajero[]>([]);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let componentIsFocused = true;

      (async () => {
        try {
          const pasajeros = await getListadoPasajeros(token);
          if (componentIsFocused && pasajeros) {
            setListadoPasajeros(pasajeros);
            setListadoPasajerosFiltrados(pasajeros);
          }
        } catch(error) {
          setMensajeError(error as string);
        }
      })();

      return () => { componentIsFocused = false; };
    }, [])
  );

  const filtrarPasajeros = (texto: string) => {
    setListadoPasajerosFiltrados(listadoPasajeros.filter((escuela) => escuela.nombre.toLowerCase().includes(texto.toLowerCase()) || escuela.apellido.toLowerCase().includes(texto.toLowerCase())));
  };

  const finalizar = () => {
    idPasajeros.length > 0
      ? guardarRecorrido()
      : setMensajeError('No se han seleccionado pasajeros.');
  };

  const guardarRecorrido = async () => {
    setMensajeError(null);

    try {
      dataRecorrido.idPasajeros = idPasajeros;
      const resp = recorrido
        ? await putRecorrido(token, dataRecorrido)
        : await postRecorrido(token, dataRecorrido);
      if(resp){
        Alert.alert('', `El recorrido ${dataRecorrido.nombre} fue ${recorrido ? 'actualizado' : 'guardado'} con éxito`);
        recorrido
          ? navigation.navigate('RecorridoDetalle', { recorrido: resp })
          : navigation.navigate('RecorridoListado');
      }
    } catch(error) {
      setMensajeError(error as string);
    }
  };

  const clickearPasajero = (id: number) => {
    idPasajeros.includes(id)
      ? setIdPasajeros(idPasajeros.filter(pid => pid != id))
      : setIdPasajeros([...idPasajeros, id]);
  };

  const crearPasajero = () => {
    navigation.navigate('PasajeroEdicion', { dataRecorrido, pasajero: null, recorrido: null });
  };

  const renderItem = (pasajero: ListRenderItemInfo<Pasajero>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => clickearPasajero(pasajero.item.id)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {pasajero.item.nombre} {pasajero.item.apellido}
          </Text>
          <Text style={styles.subtitle}>
            {pasajero.item.domicilio.domicilio}
          </Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Checkbox 
            value={idPasajeros.includes(pasajero.item.id)}
            color={'orange'}/>
        </View>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder='Buscar'
            onChangeText={filtrarPasajeros}
          />
        </View>
      </View>

      <SafeAreaView style={styles.list}>
        <FlatList data={listadoPasajerosFiltrados} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>
      
      <View style={styles.footer}>
        <PrimaryButton name={'Crear nuevo Pasajero'} action={crearPasajero} secondary={true}/>
        { mensajeError && ErrorText(mensajeError) }
        <PrimaryButton name={'Guardar Recorrido'} action={finalizar}/>
      </View>
    </View>
  );
}
