import React from 'react';
import { View, Text } from 'react-native';

export default function ErrorText(mensajeError : string){
  return (
    <View>
      <Text>
        {`Error: ${mensajeError}`}
      </Text>
    </View>
  );
}