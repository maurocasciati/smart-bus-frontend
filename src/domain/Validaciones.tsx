import { RegisterOptions, FieldValues, FieldPath } from 'react-hook-form';
import { EX_REG } from './ExpresionesRegulares';
import { MENSAJES } from './Mensajes';

type CustomRule = Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>; 

export class VALIDACIONES {
  static TEXTO_NO_VACIO: CustomRule = {
    required: MENSAJES.VALIDACION.REQUERIDO
  };
  
  static EMAIL: CustomRule = {
    required: MENSAJES.VALIDACION.REQUERIDO, 
    pattern: {value: EX_REG.EMAIL, message: MENSAJES.VALIDACION.EMAIL}
  };
  
  static EMAIL_NO_REQUERIDO: CustomRule = {
    pattern: {value: EX_REG.EMAIL, message: MENSAJES.VALIDACION.EMAIL}
  };

  static HORARIO: CustomRule = {
    required: MENSAJES.VALIDACION.REQUERIDO, 
    pattern: {value: EX_REG.HORARIO, message: MENSAJES.VALIDACION.HORARIO}
  };
  
  static TELEFONO: CustomRule = {
    required: MENSAJES.VALIDACION.REQUERIDO, 
    pattern: {value: EX_REG.TELEFONO, message: MENSAJES.VALIDACION.TELEFONO}
  };

  static FECHA: CustomRule = {
    required: MENSAJES.VALIDACION.REQUERIDO, 
    pattern: {value: EX_REG.FECHA, message: MENSAJES.VALIDACION.FECHA}
  };
}