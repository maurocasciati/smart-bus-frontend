import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View, Text, SafeAreaView, FlatList, ListRenderItemInfo, Alert } from 'react-native';
import { AuthContext } from '../auth/AuthProvider';
import ErrorText from '../components/ErrorText';
import CustomTextInput from '../components/form/CustomTextInput';
import { PasajeroFormType } from '../components/form/FormTypes';
import { TutorListadoProps } from '../components/Navigation';
import PrimaryButton from '../components/PrimaryButton';
import { Tutor } from '../domain/Tutor';
import { VALIDACIONES } from '../domain/Validaciones';
import { putPasajero } from '../services/pasajero.service';
import { styles } from '../styles/styles';
import { mapDateTimeStringToYear } from '../utils/date.utils';

export default function TutorListado({ route, navigation }: TutorListadoProps) {
  const { pasajero, recorrido } = route.params;
  
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token } = useContext(AuthContext);
  
  const {control, handleSubmit, formState: {errors}} = useForm<PasajeroFormType>({
    defaultValues: {
      id: pasajero.id,
      nombre: pasajero.nombre,
      apellido: pasajero.apellido,
      fechaNacimiento: mapDateTimeStringToYear(pasajero.fechaNacimiento),
      telefono: pasajero.telefono,
      pisoDepartamento: pasajero.pisoDepartamento,
      domicilio: {
        domicilio: pasajero.domicilio.domicilio,
        coordenadas: pasajero.domicilio.coordenadas,
      },
      emailTutor: undefined,
      emailTutores: pasajero.tutores.map(t => t.email),
    }
  });

  const guardarPasajero = async (dataPasajero: PasajeroFormType) => {
    setMensajeError(null);
    dataPasajero.emailTutores.push(dataPasajero.emailTutor);

    try {
      const resp = await putPasajero(token, dataPasajero);
      if(resp){
        Alert.alert('', `Se ha agregado los tutores del pasajero ${dataPasajero.nombre} ${dataPasajero.apellido}`);
        navigation.navigate('PasajeroEdicion', { pasajero: resp, dataRecorrido: null, recorrido });
      }
    } catch(error) {
      setMensajeError(error as string);
    }
  };

  const renderItem = (tutorItem: ListRenderItemInfo<Tutor>) => {
    const esTutorRegistrado = tutorItem.item.nombre || tutorItem.item.apellido;

    return (
      <View style={styles.line}>
        <View style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={ {...styles.title, fontStyle: esTutorRegistrado ? 'normal' : 'italic'} }>
              {
                esTutorRegistrado
                  ? tutorItem.item.nombre + ' ' + tutorItem.item.apellido
                  : 'Tutor no registrado'
              }
            </Text>
            <Text style={styles.subtitle}>
              {tutorItem.item.email}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList data={pasajero.tutores} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </SafeAreaView>

      <View style={styles.center}>
        <CustomTextInput
          control={control}
          name='emailTutor'
          errors={errors}
          placeholder='Email de invitación'
          rules={VALIDACIONES.EMAIL}
          editable={true}
        />
        { mensajeError && ErrorText(mensajeError) }
        <PrimaryButton name={'Invitar nuevo tutor'} action={handleSubmit(guardarPasajero)}/>
      </View>
    </View>
  );
}
