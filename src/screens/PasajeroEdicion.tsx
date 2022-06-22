import React, { useContext, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { PasajeroEdicionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import CustomGoogleAutocomplete from '../components/form/CustomGoogleAutocomplete';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import { PasajeroFormType } from '../components/form/FormTypes';
import DoubleButton from '../components/DobleButton';
import { AuthContext } from '../auth/AuthProvider';
import ErrorText from '../components/ErrorText';
import { postPasajero } from '../services/pasajero.service';
import { mapDateTimeStringToYear } from '../utils/date.utils';

export default function PasajeroEdicion({ route, navigation }: PasajeroEdicionProps) {
  const { pasajero, dataRecorrido, recorrido } = route.params;

  const [modoEdicion, setModoEdicion] = useState<boolean>(!pasajero);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const { token } = useContext(AuthContext);
  
  const {control, handleSubmit, formState: {errors}} = useForm<PasajeroFormType>({
    defaultValues: {
      nombre: pasajero?.nombre || '',
      apellido: pasajero?.apellido || '',
      fechaNacimiento: pasajero ? mapDateTimeStringToYear(pasajero.fechaNacimiento) : '',
      telefono: pasajero?.telefono || '',
      pisoDepartamento: pasajero?.pisoDepartamento || '',
      domicilio: pasajero?.domicilio ? {
        domicilio: pasajero?.domicilio.domicilio || '',
        coordenadas: pasajero?.domicilio.coordenadas || null,
      } : null,
    }
  });

  const guardarPasajero = async (dataPasajero: PasajeroFormType) => {
    setMensajeError(null);

    try {
      const resp = await postPasajero(token, dataPasajero);
      if(resp){
        Alert.alert('', `El pasajero ${dataPasajero.nombre} ${dataPasajero.apellido} fue guardado con éxito`);
        dataRecorrido ? navigation.navigate('PasajeroSeleccion', { dataRecorrido, recorrido })
          : recorrido ? navigation.navigate('RecorridoDetalle', { recorrido })
            : navigation.navigate('RecorridoListado');
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
          name='nombre'
          errors={errors}
          placeholder='Nombre'
          rules={VALIDACIONES.TEXTO_NO_VACIO}
          editable={modoEdicion}
        />
        <CustomTextInput
          control={control}
          name='apellido'
          errors={errors}
          placeholder='Apellido'
          rules={VALIDACIONES.TEXTO_NO_VACIO}
          editable={modoEdicion}
        />
        <CustomTextInput
          control={control}
          name='fechaNacimiento'
          errors={errors}
          placeholder='Nacimiento'
          rules={VALIDACIONES.FECHA}
          editable={modoEdicion}
        />
        <CustomTextInput
          control={control}
          name='telefono'
          errors={errors}
          placeholder='Telefono'
          rules={VALIDACIONES.TELEFONO}
          editable={modoEdicion}
        />
        { pasajero &&
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              value={pasajero?.domicilio.domicilio} 
              editable={false}
            />
          </View>
        }
        { modoEdicion &&
          <CustomGoogleAutocomplete
            control={control}
            name='domicilio'
            errors={errors}
            placeholder={pasajero ? 'Editar domicilio' : 'Domicilio'}
            rules={VALIDACIONES.TEXTO_NO_VACIO}
          />
        }
        <CustomTextInput
          control={control}
          name='pisoDepartamento'
          errors={errors}
          placeholder='Piso y departamento'
          rules={{}}
          editable={modoEdicion}
        />

        { mensajeError && ErrorText(mensajeError) }
        { modoEdicion
          ? <PrimaryButton name="Guardar Pasajero" action={handleSubmit(guardarPasajero)} />
          :
          <>
            <PrimaryButton 
              name="Ver estado de cuenta"
              action={() => recorrido && pasajero && navigation.navigate('EstadoDeCuenta', { pasajero, recorrido })} secondary={true} />
            <DoubleButton 
              name1="Establecer ausencia"
              action1={() => recorrido && pasajero && navigation.navigate('EventualidadAusencia', { recorrido, pasajero })}
              name2="Establecer cambio de domicilio"
              action2={() => recorrido && pasajero && navigation.navigate('EventualidadDomicilio', { recorrido, pasajero })}
              secondary={true} />
            <PrimaryButton name="Editar Pasajero" action={() => setModoEdicion(true)} />
          </>
        }
      </View>
    </View>
  );
}