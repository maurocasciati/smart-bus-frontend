import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { VALIDACIONES } from '../../domain/Validaciones';
import { verificarEmail } from '../../services/login.service';
import ErrorText from '../ErrorText';
import CustomTextInput from '../form/CustomTextInput';
import { DataInicialRegistroType } from '../form/FormTypes';
import PrimaryButton from '../PrimaryButton';

export default function VerificarEmail(props: { toggleVerificado: (dataUsuario: DataInicialRegistroType) => void, toggleLogin: () => void }) {
  const [verificarEmailError, setVerificarEmailError] = useState<string | null>(null);

  const {control, handleSubmit, formState: {errors}} = useForm<{ email: string }>({
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async ({ email }: { email: string }) => {
    setVerificarEmailError(null);

    try {
      const resp = await verificarEmail(email);

      if (resp) {
        const { data, status }: { data: DataInicialRegistroType, status: number } = resp;
        if (status === 204) {
          Alert.alert(
            `El usuario ${email} no está invitado a la aplicación`,
            '¿Quiere registrarse como chofer?',
            [
              { text: 'Cancelar', style: 'cancel', onPress: props.toggleLogin },
              { text: 'Registrar', style: 'destructive', onPress: () => props.toggleVerificado({ tipoDeUsuario: 1, email }) },
            ]
          );
        } else if (data.fueActivado) {
          Alert.alert('', `El usuario ${email} ya está registrado`);
          props.toggleLogin();
        } else {
          props.toggleVerificado(data);
        }
      }
    } catch(error) {
      setVerificarEmailError(error as string);
    }
  };

  return (
    <>
      <CustomTextInput
        control={control}
        name="email"
        errors={errors}
        placeholder="Email"
        rules={VALIDACIONES.EMAIL}
        editable={true}
      />

      {verificarEmailError && ErrorText(verificarEmailError)}
      <PrimaryButton name="Registrarse" action={handleSubmit(onSubmit)} />
    </>
  );
}
