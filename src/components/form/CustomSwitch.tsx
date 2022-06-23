import React from 'react';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { styles } from '../../styles/styles';

type CustomInputProps = {
  control: Control<any>,
  name: string,
  placeholderTrue: string,
  placeholderFalse: string,
  errors: FieldErrors<FieldValues>,
};

export default function CustomSwitch({control, name, placeholderTrue, placeholderFalse, errors} : CustomInputProps & {ocultarTexto?: boolean}) {
  return (
    <>
      <View>
        {errors[name] && <Text>{errors[name]?.message}</Text>}
      </View>
      <View style={styles.inputView}>
        <Controller 
          control={control}
          name={name}
          render={({ field: {onChange, value}}) => (
            <View style={{ flexDirection: 'row', alignContent: 'center' }}>
              <Text style={localstyles.textInput}>{placeholderFalse}</Text>
              <Switch
                style={{ flex: 1 }}
                trackColor={{ false: '#767577', true: '#767577' }}
                thumbColor={'orange'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onChange}
                value={value}
              />
              <Text style={localstyles.textInput}>{placeholderTrue}</Text>
            </View>
          )}
        />
      </View>
    </>
  );
}

const localstyles = StyleSheet.create({
  textInput: {
    flex: 2,
    color: 'black',
    alignSelf: 'center',
    textAlign: 'center',
  },
});