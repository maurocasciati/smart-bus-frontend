import React, { useCallback, useContext, useState } from 'react';
import { FlatList, SafeAreaView, View, Text, ListRenderItemInfo, TouchableOpacity, TextInput, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { EscuelaSeleccionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import { Escuela } from '../domain/Escuela';
import PrimaryButton from '../components/PrimaryButton';
import ErrorText from '../components/ErrorText';
import { getListadoEscuelas } from '../services/escuela.service';
import { AuthContext } from '../auth/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';

export default function EscuelaSeleccion({ route, navigation }: EscuelaSeleccionProps) {
  const { dataRecorrido, recorrido } = route.params;
  const [idEscuela, setIdEscuela] = useState<number | null>(recorrido?.escuela?.id || null);
  const [listadoEscuelas, setListadoEscuelas] = useState<Escuela[]>([]);
  const [listadoEscuelasFiltradas, setListadoEscuelasFiltradas] = useState<Escuela[]>([]);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let componentIsFocused = true;

      (async () => {
        try {
          const escuelas = await getListadoEscuelas(token);
          if (componentIsFocused && escuelas) {
            setListadoEscuelas(escuelas);
            setListadoEscuelasFiltradas(escuelas);
          }
        } catch(error) {
          setMensajeError(error as string);
        }
      })();

      return () => { componentIsFocused = false; };
    }, [])
  );

  const filtrarEscuela = (nombre: string) => {
    setListadoEscuelasFiltradas(listadoEscuelas.filter((escuela) => escuela.nombre.toLowerCase().includes(nombre.toLowerCase())));
  };

  const seleccionarEscuela = (id: number) => {
    setMensajeError(null);
    setIdEscuela(id);
  };

  const crearEscuela = () => {
    navigation.navigate('EscuelaEdicion', { dataRecorrido, escuela: null, recorrido });
  };

  const guardarRecorrido = () => {
    if (recorrido && idEscuela) {
      dataRecorrido.idEscuela = idEscuela;
      //TODO: Pegarle directamente al back y guardar el recorrido con la nueva escuela seleccionada
      console.log({dataRecorrido});
      Alert.alert('', `El recorrido ${dataRecorrido.nombre} fue actualizado con éxito`);
      navigation.navigate('RecorridoDetalle', { recorrido });
    }
  };

  const seleccionarPasajeros = () => {
    idEscuela
      ? navigation.navigate('PasajeroSeleccion', { dataRecorrido: { ...dataRecorrido, idEscuela }, recorrido: null })
      : setMensajeError('Debe seleccionar una escuela del listado.');
  };

  const renderItem = (escuela: ListRenderItemInfo<Escuela>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => seleccionarEscuela(escuela.item.id)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {escuela.item.nombre}
          </Text>
          <Text style={styles.subtitle}>
            {escuela.item.direccion.domicilio}
          </Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Checkbox 
            value={idEscuela === escuela.item.id}
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
            onChangeText={filtrarEscuela}
          />
        </View>
      </View>

      <SafeAreaView style={styles.list}>
        <FlatList data={listadoEscuelasFiltradas} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>
      
      <View style={styles.footer}>
        <PrimaryButton name={'Crear nueva Escuela'} action={crearEscuela} secondary={true}/>
        { mensajeError && ErrorText(mensajeError) }
        { recorrido
          ? <PrimaryButton name={'Guardar'} action={guardarRecorrido}/>
          : <PrimaryButton name={'Seleccionar Pasajeros'} action={seleccionarPasajeros}/>
        }
      </View>
    </View>
  );
}
