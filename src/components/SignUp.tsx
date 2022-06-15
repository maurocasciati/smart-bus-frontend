import { REACT_APP_BASE_URL } from '@env';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, TextInput, Text, Button } from 'react-native';
import { VALIDACIONES } from '../domain/Validaciones';
import { styles } from '../styles/styles';
import CustomTextInput from './form/CustomTextInput';
import PrimaryButton from './PrimaryButton';

type FormType = {
  nombre: string,
  apellido: string,
  email: string,
  contraseña: string
};

export default function SignUp() {

  const [signUpError, setSignUpError] = useState('');
  
  const {control, handleSubmit, formState: {errors}} = useForm<FormType>({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      contraseña: ''
    }
  });

  const onSubmit = async (data: FormType) => {
    try{
      const resp = await axios.post(`${REACT_APP_BASE_URL}/Usuario/registrar`, data);
      if(resp){
        alert(`El usuario ${data.email} fue registrado con exito`);
      }
    }
    catch(error){
      if(axios.isAxiosError(error)){
        const err = error as AxiosError;
        const errorResponse = err.response as AxiosResponse<{message?: string, title: string}>;
        if(errorResponse.data)
          setSignUpError(errorResponse.data.message ?? errorResponse.data.title);
        else
          setSignUpError(err.message);
      }
      else{
        setSignUpError(error as string);
      }
    }
  };
  
  return (
    <>
      <CustomTextInput
        control={control}
        name="nombre"
        errors={errors}
        placeholder="Nombre"
        rules={VALIDACIONES.TEXTO_NO_VACIO}
      />

      <CustomTextInput
        control={control}
        name="apellido"
        errors={errors}
        placeholder="Apellido"
        rules={VALIDACIONES.TEXTO_NO_VACIO}
      />

      <CustomTextInput
        control={control}
        name="email"
        errors={errors}
        placeholder="E-Mail"
        rules={VALIDACIONES.EMAIL}
      />

      <CustomTextInput
        control={control}
        name="contraseña"
        errors={errors}
        placeholder="Contraseña"
        rules={VALIDACIONES.TEXTO_NO_VACIO}
        ocultarTexto={true}
      />

      {signUpError ? ErrorText(signUpError) : null}
      <PrimaryButton name="Submit" action={handleSubmit(onSubmit)} />
    </>
  );
}

function ErrorText(mensajeError : string){
  return (
    <View>
      <Text>
        {`Error: ${mensajeError}`}
      </Text>
    </View>
  );
}