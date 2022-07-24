import { REACT_APP_BASE_URL as baseUrl } from '@env';
import axios from 'axios';
import { SignUpFormType } from '../components/form/FormTypes';
import { throwError } from '../utils/service.utils';

export const signIn = async (email: string, password: string) => {
  try {
    return await axios.post<{token: string, idTipoDeUsuario: number, id: number}>(`${baseUrl}/Usuario/autenticar`, {email, password});
  } catch(error) {
    throwError(error);
  }
};

export const signUp = async (data: SignUpFormType) => {
  try {
    return await axios.put(`${baseUrl}/Usuario/completarRegistro`, data);
  } catch(error) {
    throwError(error);
  }
};

export const verificarEmail = async (email: string) => {
  try {
    return await axios.get(`${baseUrl}/Usuario/verificar-mail`, { params: { email } });
  } catch(error) {
    throwError(error);
  }
};
