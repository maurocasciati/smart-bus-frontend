import { REACT_APP_BASE_URL as baseUrl } from '@env';
import axios from 'axios';
import { SignUpFormType } from '../components/form/FormTypes';
import { throwError } from '../utils/service.utils';

export const signIn = async (email: string, password: string) => {
  try {
    return await axios.post<{token: string, idTipoDeUsuario: number}>(`${baseUrl}/Usuario/autenticar`, {email, password});
  } catch(error) {
    throwError(error);
  }
};

export const signUp = async (data: SignUpFormType) => {
  try {
    return await axios.post(`${baseUrl}/Usuario/registrar`, data);
  } catch(error) {
    throwError(error);
  }
};
