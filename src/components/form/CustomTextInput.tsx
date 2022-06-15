import React from 'react';
import { Control, Controller, FieldErrors, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { View, TextInput, Text } from 'react-native';
import { styles } from '../../styles/styles';

type CustomInputProps = {
  control: Control<any>;
  name: string;
  rules: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  placeholder: string
  errors: FieldErrors<FieldValues>
};

export default function CustomTextInput({control, name, rules, placeholder, errors, ocultarTexto} : CustomInputProps & {ocultarTexto?: boolean}) {
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
            <TextInput
              placeholder={placeholder}
              style={styles.textInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value} 
              secureTextEntry={ocultarTexto}
            />
          )}
        />
      </View>
    </>
  );
}