import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { VALIDACIONES } from '../domain/Validaciones';
import { signUp } from '../services/login.service';
import ErrorText from './ErrorText';
import CustomTextInput from './form/CustomTextInput';
import { SignUpFormType } from './form/FormTypes';
import PrimaryButton from './PrimaryButton';

export default function SignUp(props: { toggleLogin: () => void}) {
  const [signUpError, setSignUpError] = useState<string | null>(null);
  
  const {control, handleSubmit, formState: {errors}} = useForm<SignUpFormType>({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      contraseña: ''
    }
  });

  const onSubmit = async (dataSignUp: SignUpFormType) => {
    setSignUpError(null);

    try {
      const resp = await signUp(dataSignUp);
      if(resp){
        Alert.alert('', `El usuario ${dataSignUp.email} fue registrado con exito`);
        props.toggleLogin();
      }
    } catch(error) {
      setSignUpError(error as string);
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
        editable={true}
      />

      <CustomTextInput
        control={control}
        name="apellido"
        errors={errors}
        placeholder="Apellido"
        rules={VALIDACIONES.TEXTO_NO_VACIO}
        editable={true}
      />

      <CustomTextInput
        control={control}
        name="email"
        errors={errors}
        placeholder="E-Mail"
        rules={VALIDACIONES.EMAIL}
        editable={true}
      />

      <CustomTextInput
        control={control}
        name="contraseña"
        errors={errors}
        placeholder="Contraseña"
        rules={VALIDACIONES.TEXTO_NO_VACIO}
        ocultarTexto={true}
        editable={true}
      />

      {signUpError && ErrorText(signUpError)}
      <PrimaryButton name="Registrarse" action={handleSubmit(onSubmit)} />
    </>
  );
}
