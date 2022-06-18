import React, { useState } from 'react';
import { View } from 'react-native';
import { RecorridoEdicionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import { Pasajero } from '../domain/Pasajero';
import { Escuela } from '../domain/Escuela';
import ErrorText from '../components/ErrorText';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { REACT_APP_BASE_URL } from '@env';
import CustomSwitch from '../components/form/CustomSwitch';

type FormType = {
  nombre: string,
  esIda: boolean,
  horario: string,
  pasajeros: Pasajero[],
  escuela: Escuela,
};

export default function RecorridoEdicion({ route, navigation }: RecorridoEdicionProps) {
  const { recorrido } = route.params;
  
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  
  const {control, handleSubmit, formState: {errors}, reset} = useForm<FormType>({
    defaultValues: {
      nombre: recorrido?.nombre || '',
      esIda: recorrido?.esIda || false,
      horario: recorrido?.horario || '',
      pasajeros: recorrido?.pasajeros || [],
      escuela: recorrido?.escuela || undefined,
    }
  });

  const onSubmit = async (data: FormType) => {
    setMensajeError(null);
    console.log(data);
    // try{
    //   const resp = await axios.post(`${REACT_APP_BASE_URL}/Usuario/registrar`, data);
    //   if(resp){
    //     alert(`El recorrido ${data.nombre} fue creado con éxito`);
    //     reset();
    //   }
    // }
    // catch(error){
    //   if(axios.isAxiosError(error)){
    //     const err = error as AxiosError;
    //     const errorResponse = err.response as AxiosResponse<{message?: string, title: string}>;
    //     if(errorResponse.data)
    //       setMensajeError(errorResponse.data.message ?? errorResponse.data.title);
    //     else
    //       setMensajeError(err.message);
    //   }
    //   else{
    //     setMensajeError(error as string);
    //   }
    // }
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <CustomTextInput
          control={control}
          name='nombre'
          errors={errors}
          placeholder='Nombre'
          rules={VALIDACIONES.TEXTO_NO_VACIO}
        />
        <CustomSwitch
          control={control}
          name='esIda'
          errors={errors}
          placeholderTrue='Ida'
          placeholderFalse='Vuelta'
        />
        <CustomTextInput
          control={control}
          name='hora'
          errors={errors}
          placeholder='Horario (HH:MM)'
          rules={VALIDACIONES.HORARIO}
        />


        {mensajeError && ErrorText(mensajeError)}
        <PrimaryButton name="test" action={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}
