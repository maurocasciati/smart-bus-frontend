import React, { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import { EventualidadDomicilioProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import { EventualidadFormType } from '../components/form/FormTypes';
import CustomGoogleAutocomplete from '../components/form/CustomGoogleAutocomplete';
import ErrorText from '../components/ErrorText';
import { postEventualidad } from '../services/eventualidad.service';
import { AuthContext } from '../auth/AuthProvider';
import { RolUsuario } from '../domain/RolUsuario';
import CustomDatePicker from '../components/form/CustomDatePicker';
import CustomNumberInput from '../components/form/CustomNumberInput';
import { mapDateTimeStringToYear } from '../utils/date.utils';

export default function EventualidadDomicilio({ route, navigation }: EventualidadDomicilioProps) {
  const { pasajero, recorrido } = route.params;
  
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token, rol } = useContext(AuthContext);
  
  const {control, handleSubmit, formState: {errors}} = useForm<EventualidadFormType>({
    defaultValues: {
      idPasajero: pasajero.id,
      idRecorrido: recorrido.id,
      fechaInicio: '',
      fechaFin: '',
      inicio: new Date(),
      duracion: '1',
      direccion: null,
    }
  });

  const guardarEventualidad = async (dataEventualidad: EventualidadFormType) => {
    setMensajeError(null);
    const fechaFin = new Date();
    fechaFin.setDate(dataEventualidad.inicio.getDate() + +dataEventualidad.duracion);
    dataEventualidad.fechaFin = mapDateTimeStringToYear(fechaFin);
    dataEventualidad.fechaInicio = mapDateTimeStringToYear(dataEventualidad.inicio);

    try {
      const resp = await postEventualidad(token, dataEventualidad);
      if(resp){
        Alert.alert('', `Se guardó el cambio de domicilio temporal para el pasajero ${pasajero.nombre} ${pasajero.apellido}`);
        rol?.valueOf() === RolUsuario.CHOFER
          ? navigation.navigate('PasajeroEdicion', { dataRecorrido: null, recorrido, pasajero })
          : navigation.navigate('PasajeroDetalleTutor', { recorrido, pasajero });
      }
    } catch(error) {
      setMensajeError(error as string);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <CustomDatePicker
          control={control}
          name='inicio'
          errors={errors}
          placeholder='Fecha desde'
          rules={VALIDACIONES.TEXTO_NO_VACIO}
          minimumDate={new Date()}
        />
        <CustomNumberInput
          placeholder='Duración: '
          unidad='día/s'
          name='duracion'
          control={control}
          errors={errors}
          rules={VALIDACIONES.TEXTO_NO_VACIO}
        />
        <CustomGoogleAutocomplete
          control={control}
          name='direccion'
          errors={errors}
          placeholder='Domicilio temporal'
          rules={VALIDACIONES.TEXTO_NO_VACIO}
        />

        { mensajeError && ErrorText(mensajeError) }
        <PrimaryButton name="Guardar" action={handleSubmit(guardarEventualidad)} />
      </View>
    </View>
  );
}
