import React from 'react';
import { Control, Controller, FieldErrors, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { styles } from '../../styles/styles';

type CustomInputProps = {
  control: Control<any>,
  name: string,
  rules: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>,
  placeholder: string,
  unidad: string,
  errors: FieldErrors<FieldValues>,
};

export default function CustomNumberInput({control, name, rules, placeholder, unidad, errors}: CustomInputProps) {
  return (
    <>
      <View>
        {errors[name] && <Text>{errors[name]?.message}</Text>}
      </View>
      <Controller 
        control={control}
        name={name}
        rules={rules}
        render={({ field: {onChange, onBlur, value}}) => (
          <View style={localstyles.inputView}>
            <Text style={styles.textInput}>{placeholder}</Text>
            <TextInput
              keyboardType='numeric'
              style={localstyles.textInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value} 
            />
            <Text style={styles.textInput}>{unidad}</Text>
          </View>
        )}
      />
    </>
  );
}

const localstyles = StyleSheet.create({
  inputView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
    elevation: 4,
  },
  textInput: {
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },
});
