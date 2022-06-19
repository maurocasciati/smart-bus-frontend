import { REACT_APP_BASE_URL } from '@env';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VALIDACIONES } from '../domain/Validaciones';
import ErrorText from './ErrorText';
import CustomTextInput from './form/CustomTextInput';
import PrimaryButton from './PrimaryButton';

type FormType = {
  nombre: string,
  apellido: string,
  email: string,
  contraseña: string
};

export default function SignUp() {

  const [signUpError, setSignUpError] = useState<string | null>(null);
  
  const {control, handleSubmit, formState: {errors}, reset} = useForm<FormType>({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      contraseña: ''
    }
  });

  const onSubmit = async (data: FormType) => {
    setSignUpError(null);
    try{
      const resp = await axios.post(`${REACT_APP_BASE_URL}/Usuario/registrar`, data);
      if(resp){
        alert(`El usuario ${data.email} fue registrado con exito`);
        reset();
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

      {signUpError && ErrorText(signUpError)}
      <PrimaryButton name="Registrarse" action={handleSubmit(onSubmit)} />
    </>
  );
}
