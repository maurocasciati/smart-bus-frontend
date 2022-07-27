import { REACT_APP_BASE_URL as baseUrl } from '@env';
import { HistorialRecorridoType } from '../components/form/FormTypes';
import { HistorialRecorrido } from '../domain/HistorialRecorrido';
import { authGet, authPost, throwError } from '../utils/service.utils';

export const getHistorialRecorridos = async (token: string | null, idRecorrido: number) => {
  try {
    const resp = await authGet<HistorialRecorrido[]>(`${baseUrl}/HistorialRecorrido/${idRecorrido}`, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};

export const postHistorialRecorrido = async (token: string | null, data: HistorialRecorridoType) => {
  try {
    const resp = await authPost(`${baseUrl}/HistorialRecorrido`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};
