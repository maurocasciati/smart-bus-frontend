import { REACT_APP_BASE_URL as baseUrl } from '@env';
import axios from 'axios';
import { SignUpFormType } from '../components/form/FormTypes';
import { Escuela } from '../domain/Escuela';
import { throwError } from '../utils/service.utils';

export const getListadoEscuelas = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  try {
    const resp = await axios.get<Escuela[]>(`${baseUrl}/Escuela`, config);
    return resp.data;
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
