import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Control, Controller, FieldErrors, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { View, Text } from 'react-native';
import { getTipoUsuario, RolUsuario } from '../../domain/RolUsuario';
import { styles } from '../../styles/styles';

type CustomDropdownProps = {
  control: Control<any>,
  name: string,
  rules: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>,
  placeholder: string,
  errors: FieldErrors<FieldValues>,
};

export default function RolDropdown({ control, name, rules, placeholder, errors }: CustomDropdownProps) {
  return (
    <>
      <View>
        {errors[name] && <Text>{errors[name]?.message}</Text>}
      </View>
      <View style={styles.inputView}>
        <Controller 
          control={control}
          name={name}
          rules={rules}
          render={({ field: {onChange, onBlur, value}}) => (
            <Picker
              placeholder={placeholder}
              style={styles.textInput}
              onBlur={onBlur}
              onValueChange={onChange}
              selectedValue={value} 
            >
              <Picker.Item label={getTipoUsuario[RolUsuario.CHOFER]} value={RolUsuario.CHOFER} style={styles.subtitle} />
              <Picker.Item label={getTipoUsuario[RolUsuario.TUTOR]} value={RolUsuario.TUTOR} style={styles.subtitle} />
              <Picker.Item label={getTipoUsuario[RolUsuario.ESCUELA]} value={RolUsuario.ESCUELA} style={styles.subtitle} />
            </Picker>
          )}
        />
      </View>
    </>
  );
}