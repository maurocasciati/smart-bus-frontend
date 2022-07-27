import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Control, Controller, FieldErrors, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/styles';
import { mapDateTimeStringToYear } from '../../utils/date.utils';

type CustomInputProps = {
  control: Control<any>,
  name: string,
  rules: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>,
  placeholder: string,
  errors: FieldErrors<FieldValues>,
  minimumDate?: Date,
  maximumDate?: Date,
};

export default function CustomDatePicker({control, name, rules, placeholder, errors, minimumDate, maximumDate}: CustomInputProps) {
  const [show, setShow] = useState(false);

  const cambiarFecha = (field: any, date: Date) => {
    field.onChange(date);
    setShow(false);
  };

  return (
    <>
      <View>
        {errors[name] && <Text>{errors[name]?.message}</Text>}
      </View>
      <TouchableOpacity
        style={styles.inputView}
        onPress={() => setShow(true)}>
        <Controller 
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => (<>
            <Text style={styles.textInput}>
              {placeholder + ': ' + mapDateTimeStringToYear(field.value)}
            </Text>
            { show && <DateTimePicker
              onChange={(event: any, date: any) => cambiarFecha(field, date)}
              value={field.value}
              testID='dateTimePicker'
              mode='date'
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            /> }
          </>)}
        />
      </TouchableOpacity>
    </>
  );
}