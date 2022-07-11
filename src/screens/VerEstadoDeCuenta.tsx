import { useFocusEffect } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import React, { useCallback, useContext, useState } from 'react';
import { View, Text, SafeAreaView, ListRenderItemInfo, TouchableOpacity, FlatList, Alert } from 'react-native';
import { AuthContext } from '../auth/AuthProvider';
import ErrorText from '../components/ErrorText';
import { EstadoDeCuentaProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { EstadoDeCuenta, EstadoDeCuentaTexto } from '../domain/EstadoDeCuenta';
import { RolUsuario } from '../domain/RolUsuario';
import { mockEstadoDeCuenta } from '../mocks';
import { getEstadoDeCuenta, putEstadoDeCuenta } from '../services/estadoDeCuenta.service';
import { styles } from '../styles/styles';

export default function VerEstadoDeCuenta({ route, navigation }: EstadoDeCuentaProps) {
  const { pasajero, recorrido } = route.params;

  const [estadoDeCuenta, setEstadoDeCuenta] = useState<EstadoDeCuenta>(mockEstadoDeCuenta);
  const [estadoDeCuentaEditado, setEstadoDeCuentaEditado] = useState<EstadoDeCuenta>(mockEstadoDeCuenta);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token, rol } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      let componentIsFocused = true;

      (async () => {
        try {
          const estadoDeCuenta = await getEstadoDeCuenta(token, recorrido.id, pasajero.id);
          if (componentIsFocused && estadoDeCuenta) {
            setEstadoDeCuenta(estadoDeCuenta);
            setEstadoDeCuentaEditado(estadoDeCuenta);
          }
        } catch(error) {
          setMensajeError(error as string);
        }
      })();

      return () => { componentIsFocused = false; };
    }, [])
  );

  const guardarCambios = async () => {
    setMensajeError(null);

    if (estadoDeCuenta === estadoDeCuentaEditado) {
      setMensajeError('El estado de cuenta no fue modificado.');
    } else {
      try {
        const resp = await putEstadoDeCuenta(token, estadoDeCuentaEditado, recorrido.id, pasajero.id);
        if(resp){
          Alert.alert('', `El estado de cuenta del pasajero ${pasajero.nombre} ${pasajero.apellido} del recorrido ${recorrido.nombre} fue guardado con éxito`);
          navigation.navigate('PasajeroEdicion', { dataRecorrido: null, pasajero, recorrido });
        }
      } catch(error) {
        setMensajeError(error as string);
      }
    }
  };

  const renderItem = (key: ListRenderItemInfo<string>) => (
    <View style={styles.line}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => setEstadoDeCuentaEditado({
          ...estadoDeCuentaEditado,
          [key.item as keyof EstadoDeCuenta]: !estadoDeCuentaEditado[key.item as keyof EstadoDeCuenta],
        })}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            { EstadoDeCuentaTexto[key.item as keyof EstadoDeCuenta] }
          </Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          { rol?.valueOf() === RolUsuario.CHOFER ?
            <Checkbox 
              value={estadoDeCuentaEditado[key.item as keyof EstadoDeCuenta]}
              color={'orange'}/>
            : 
            <Text style={{ ...styles.title, color: 'orange' }} > {estadoDeCuenta[key.item as keyof EstadoDeCuenta] ? 'Pagado' : ''} </Text>
          }
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
        { mensajeError && ErrorText(mensajeError) }
        { rol?.valueOf() === RolUsuario.CHOFER &&
          <PrimaryButton name={'Guardar cambios'} action={guardarCambios}/>
        }
      </View>
    </View>
  );
}
