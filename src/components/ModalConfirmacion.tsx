import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import DoubleButton from './DobleButton';

export default function ModalConfirmacion(props: { visible: boolean, text: string, cancel: () => void, confirm: () => void}) {
  const { visible, text, cancel, confirm } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      visible={visible}
      onRequestClose={() => {
        cancel();
      }}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <View style={localstyles.modalView}>
          <Text style={localstyles.modalText}>{text}</Text>
          <DoubleButton 
            name1="Volver"
            action1={cancel}
            secondary1={true}
            name2="Aceptar"
            action2={confirm}
          />
        </View>
      </View>
    </Modal>
  );
}

const localstyles = StyleSheet.create({
  modalView: {
    margin: 50,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 6,
  },
  modalText: {
    fontSize: 18,
    padding: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
});
  
