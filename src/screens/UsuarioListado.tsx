import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, Alert } from 'react-native';
import { AuthContext } from '../auth/AuthProvider';
import ErrorText from '../components/ErrorText';
import CustomTextInput from '../components/form/CustomTextInput';
import { EscuelaFormType } from '../components/form/FormTypes';
import { UsuarioListadoProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { Tutor } from '../domain/Tutor';
import { VALIDACIONES } from '../domain/Validaciones';
import { putEscuela } from '../services/escuela.service';
import { styles } from '../styles/styles';

export default function UsuarioListado({ route, navigation }: UsuarioListadoProps) {
  const { escuela, recorrido } = route.params;
  
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token } = useContext(AuthContext);
  
  const {control, handleSubmit, formState: {errors}} = useForm<EscuelaFormType>({
    defaultValues: {
      id: escuela?.id,
      nombre: escuela?.nombre || '',
      direccion: escuela?.direccion ? {
        domicilio: escuela?.direccion.domicilio || '',
        coordenadas: escuela?.direccion.coordenadas || null,
      } : null,
      emailUsuario: undefined,
      emailUsuarios: escuela?.usuarios?.map(e => e.email) || [],
    }
  });

  const guardarEscuela = async (dataEscuela: EscuelaFormType) => {
    setMensajeError(null);
    dataEscuela.emailUsuarios.push(dataEscuela.emailUsuario);

    try {
      const resp = await putEscuela(token, dataEscuela);
      if(resp){
        Alert.alert('', `Se ha creado un nuevo usuario para la escuela ${dataEscuela.nombre}`);
        navigation.navigate('EscuelaEdicion', { escuela: resp, dataRecorrido: null, recorrido });
      }
    } catch(error) {
      setMensajeError(error as string);
    }
  };

  const renderItem = (usuarioItem: ListRenderItemInfo<Tutor>) => {
    const esUsuarioRegistrado = usuarioItem.item.nombre || usuarioItem.item.apellido;

    return (
      <View style={styles.line}>
        <View style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={ {...styles.title, fontStyle: esUsuarioRegistrado ? 'normal' : 'italic'} }>
              {
                esUsuarioRegistrado
                  ? usuarioItem.item.nombre + ' ' + usuarioItem.item.apellido
                  : 'Usuario no registrado'
              }
            </Text>
            <Text style={styles.subtitle}>
              {usuarioItem.item.email}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList data={escuela.usuarios} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>

      <View style={styles.center}>
        <CustomTextInput
          control={control}
          name='emailUsuario'
          errors={errors}
          placeholder='Email de invitación'
          rules={VALIDACIONES.EMAIL}
          editable={true}
        />
        { mensajeError && ErrorText(mensajeError) }
        <PrimaryButton name={'Invitar nuevo usuario'} action={handleSubmit(guardarEscuela)}/>
      </View>
    </View>
  );
}
