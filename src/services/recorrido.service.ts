import { REACT_APP_BASE_URL as baseUrl } from '@env';
import { RecorridoFormType } from '../components/form/FormTypes';
import { Recorrido } from '../domain/Recorrido';
import { authGet, authPost, throwError } from '../utils/service.utils';

export const getListadoRecorridos = async (token: string | null) => {
  try {
    const resp = await authGet<Recorrido[]>(`${baseUrl}/Recorrido`, token);
    return resp.data as Recorrido[];
  } catch(error) {
    throwError(error);
  }
};

export const postRecorrido = async (token: string | null, data: RecorridoFormType) => {
  try {
    const resp = await authPost<Recorrido>(`${baseUrl}/Recorrido`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};
