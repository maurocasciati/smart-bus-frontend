import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { EscuelaEdicionProps } from '../components/Navigation';
import { styles } from '../styles/styles';
import PrimaryButton from '../components/PrimaryButton';
import CustomTextInput from '../components/form/CustomTextInput';
import { VALIDACIONES } from '../domain/Validaciones';
import { useForm } from 'react-hook-form';
import CustomGoogleAutocomplete from '../components/form/CustomGoogleAutocomplete';
import { EscuelaFormType } from '../components/form/FormTypes';

export default function EscuelaEdicion({ route, navigation }: EscuelaEdicionProps) {
  const { escuela, dataRecorrido, recorrido } = route.params;
  
  const [modoEdicion, setModoEdicion] = useState<boolean>(!recorrido);
  
  const {control, handleSubmit, formState: {errors}} = useForm<EscuelaFormType>({
    defaultValues: {
      nombre: escuela?.nombre || '',
      direccion: escuela?.domicilio ? {
        domicilio: escuela?.domicilio || '',
        coordenadas: escuela?.coordenadas || null,
      } : null,
      telefono: escuela?.telefono || '',
    }
  });

  const guardarEscuela = async (dataEscuela: EscuelaFormType) => {
    console.log({ dataEscuela });
    // TODO: Pegarle al back para guardar escuela antes de esto: vvvvv
    Alert.alert('', `La escuela ${dataEscuela.nombre} fue guardada con éxito`);
    dataRecorrido ? navigation.navigate('EscuelaSeleccion', { dataRecorrido, recorrido })
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
          name='telefono'
          errors={errors}
          placeholder='Telefono'
          rules={VALIDACIONES.TELEFONO}
          editable={modoEdicion}
        />
        { escuela &&
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              value={escuela?.domicilio}
              editable={false}
            />
          </View>
        }
        { modoEdicion &&
          <CustomGoogleAutocomplete
            control={control}
            name='direccion'
            errors={errors}
            placeholder='Editar dirección'
            rules={VALIDACIONES.TEXTO_NO_VACIO}
          />
        }

        { modoEdicion
          ? <PrimaryButton name="Guardar Escuela" action={handleSubmit(guardarEscuela)} />
          : <PrimaryButton name="Editar Escuela" action={() => setModoEdicion(true)} />
        }
      </View>
    </View>
  );
}
