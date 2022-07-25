import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';

export default function Notificacion(props: { visible: boolean, text: string}) {
  const { visible, text } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      visible={visible}>
      <View style={localstyles.notificacion}>
        <Text style={localstyles.texto}>{text}</Text>
      </View>
    </Modal>
  );
}

const localstyles = StyleSheet.create({
  notificacion: {
    marginTop: 100,
    borderRadius: 20,
    elevation: 6,
    backgroundColor: 'orange',
    margin: 25,
    height: 45,
  },
  texto: {
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
  },
});
  
