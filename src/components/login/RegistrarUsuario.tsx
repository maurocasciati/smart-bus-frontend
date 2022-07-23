import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { VALIDACIONES } from '../../domain/Validaciones';
import { signUp } from '../../services/login.service';
import ErrorText from '../ErrorText';
import CustomTextInput from '../form/CustomTextInput';
import { DataInicialRegistroType, SignUpFormType } from '../form/FormTypes';
import PrimaryButton from '../PrimaryButton';
import CustomText from '../form/CustomText';

export default function RegistrarUsuario(props: { toggleLogin: () => void, dataInicial?: DataInicialRegistroType }) {
  const [registrarUsuarioError, setRegistrarUsuarioError] = useState<string | null>(null);
  
  const {control, handleSubmit, formState: {errors}} = useForm<SignUpFormType>({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: props.dataInicial?.email,
      contraseña: '',
      tipoDeUsuario: props.dataInicial?.tipoDeUsuario,
    }
  });


  const onSubmit = async (dataRegistro: SignUpFormType) => {
    setRegistrarUsuarioError(null);

    try {
      const resp = await signUp(dataRegistro);
      if(resp){
        Alert.alert('', `El usuario ${dataRegistro.email} fue registrado con exito`);
        props.toggleLogin();
      }
    } catch(error) {
      setRegistrarUsuarioError(error as string);
    }
  };

  return (
    <>
      { props.dataInicial && <CustomText value={props.dataInicial.email}/> }

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
        name="contraseña"
        errors={errors}
        placeholder="Contraseña"
        rules={VALIDACIONES.TEXTO_NO_VACIO}
        ocultarTexto={true}
        editable={true}
      />

      {registrarUsuarioError && ErrorText(registrarUsuarioError)}
      <PrimaryButton name="Registrarse" action={handleSubmit(onSubmit)} />
    </>
  );
}
