import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { PasajeroEdicionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import CustomGoogleAutocomplete from '../components/form/CustomGoogleAutocomplete';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import { PasajeroFormType } from '../components/form/FormTypes';
import DoubleButton from '../components/DobleButton';

export default function PasajeroEdicion({ route, navigation }: PasajeroEdicionProps) {
  const { pasajero, dataRecorrido, recorrido } = route.params;

  const [modoEdicion, setModoEdicion] = useState<boolean>(!recorrido);
  
  const {control, handleSubmit, formState: {errors}} = useForm<PasajeroFormType>({
    defaultValues: {
      nombre: pasajero?.nombre || '',
      apellido: pasajero?.apellido || '',
      nacimiento: pasajero?.nacimiento || '',
      telefono: pasajero?.telefono || '',
      piso_dpto: pasajero?.piso_dpto || '',
      domicilio: {
        domicilio: pasajero?.domicilio || '',
        coordenadas: pasajero?.coordenadas || null,
      },
    }
  });

  const guardarPasajero = async (dataPasajero: PasajeroFormType) => {
    console.log({ dataPasajero });
    // TODO: Pegarle al back para guardar pasajero antes de esto: vvvvv

    alert(`El pasajero ${dataPasajero.nombre} fue guardado con éxito`);
    dataRecorrido ? navigation.navigate('PasajeroSeleccion', { dataRecorrido, recorrido: null })
      : recorrido ? navigation.navigate('RecorridoDetalle', { recorrido })
        : navigation.navigate('RecorridoListado');
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
          name='nacimiento'
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
              value={pasajero?.domicilio} 
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
          name='piso_dpto'
          errors={errors}
          placeholder='Piso y departamento'
          rules={{}}
          editable={modoEdicion}
        />

        { modoEdicion
          ? <PrimaryButton name="Guardar Pasajero" action={handleSubmit(guardarPasajero)} />
          :
          <>
            <PrimaryButton name="Ver estado de cuenta" action={() => navigation.navigate('NotFound')} secondary={true} />
            <DoubleButton name1="Establecer ausencia" name2="Establecer cambio de domicilio" action1={() => []} action2={() => []} secondary={true} />
            <PrimaryButton name="Editar Pasajero" action={() => setModoEdicion(true)} />
          </>
        }
      </View>
    </View>
  );
}