import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import DoubleButton from './DobleButton';
import PrimaryButton from './PrimaryButton';

export default function ModalConfirmacion(props: { visible: boolean, text: string, subtext?: string, cancel: () => void, confirm?: () => void}) {
  const { visible, text, subtext, cancel, confirm } = props;

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
          { subtext && <Text style={localstyles.modalSubtext}>{subtext}</Text> }
          { confirm 
            ? 
            <DoubleButton 
              name1='Volver'
              action1={cancel}
              secondary1={true}
              name2='Aceptar'
              action2={confirm}
            />
            : 
            <View style={{ width: 240, paddingLeft: 15 }}>
              <PrimaryButton
                name='Volver'
                action={cancel}
              />
            </View>
          }
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
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 6,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    padding: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtext: {
    fontSize: 14,
    marginBottom: 10,
  },
});
  
