import React, { useState } from 'react';
import { Modal, View, StyleSheet, TextInput } from 'react-native';
import DoubleButton from './DobleButton';

export default function ModalInput(props: { visible: boolean, text: string, cancel: () => void, confirm: (texto: string) => void}) {
  const { visible, text, cancel, confirm } = props;
  const [texto, setTexto] = useState<string>('');

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
          <TextInput
            multiline
            numberOfLines={4}
            placeholder={text}
            style={localstyles.textInput}
            onChangeText={setTexto}
            value={texto}
          />
          <DoubleButton 
            name1='Cancelar'
            action1={cancel}
            secondary1={true}
            name2='Enviar'
            action2={() => {
              confirm(texto);
              setTexto('');
              cancel();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const localstyles = StyleSheet.create({
  modalView: {
    margin: 50,
    backgroundColor: 'peachpuff',
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
  textInput: {
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    borderRadius: 30,
    color: 'black',
    height: 150,
    padding: 15,
    margin: 20,
    elevation: 4,
    width: 250
  },
});
  
