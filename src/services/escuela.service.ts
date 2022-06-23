import { REACT_APP_BASE_URL as baseUrl } from '@env';
import { EscuelaFormType } from '../components/form/FormTypes';
import { Escuela } from '../domain/Escuela';
import { authGet, authPost, authPut, throwError } from '../utils/service.utils';

export const getListadoEscuelas = async (token: string | null) => {
  try {
    const resp = await authGet<Escuela[]>(`${baseUrl}/Escuela`, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};

export const postEscuela = async (token: string | null, data: EscuelaFormType) => {
  try {
    const resp = await authPost<Escuela>(`${baseUrl}/Escuela`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};

export const putEscuela = async (token: string | null, data: EscuelaFormType) => {
  try {
    const resp = await authPut<Escuela>(`${baseUrl}/Escuela`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};
