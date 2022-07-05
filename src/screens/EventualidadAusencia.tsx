import React, { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import { EventualidadAusenciaProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import { EventualidadFormType } from '../components/form/FormTypes';
import { AuthContext } from '../auth/AuthProvider';
import { postEventualidad } from '../services/eventualidad.service';
import ErrorText from '../components/ErrorText';

export default function EventualidadAusencia({ route, navigation }: EventualidadAusenciaProps) {
  const { pasajero, recorrido } = route.params;
  
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token } = useContext(AuthContext);
  
  const {control, handleSubmit, formState: {errors}} = useForm<EventualidadFormType>({
    defaultValues: {
      idPasajero: pasajero.id,
      idRecorrido: recorrido.id,
      fechaInicio: '',
      fechaFin: '',
      direccion: null,
    }
  });

  const guardarEventualidad = async (dataEventualidad: EventualidadFormType) => {
    setMensajeError(null);

    try {
      const resp = await postEventualidad(token, dataEventualidad);
      if(resp){
        Alert.alert('', `Se guardó la ausencia para el pasajero ${pasajero.nombre} ${pasajero.apellido}`);
        navigation.navigate('PasajeroEdicion', { dataRecorrido: null, recorrido, pasajero });
      }
    } catch(error) {
      setMensajeError(error as string);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <CustomTextInput
          control={control}
          name='fechaInicio'
          errors={errors}
          placeholder='Fecha desde'
          rules={VALIDACIONES.FECHA}
          editable={true}
        />
        <CustomTextInput
          control={control}
          name='fechaFin'
          errors={errors}
          placeholder='Fecha hasta'
          rules={VALIDACIONES.FECHA}
          editable={true}
        />

        { mensajeError && ErrorText(mensajeError) }
        <PrimaryButton name="Guardar" action={handleSubmit(guardarEventualidad)} />
      </View>
    </View>
  );
}
