import { REACT_APP_BASE_URL as baseUrl } from '@env';
import { RecorridoFormType } from '../components/form/FormTypes';
import { Recorrido } from '../domain/Recorrido';
import { mapTimeToDateTimeString } from '../utils/date.utils';
import { authDelete, authGet, authPost, authPut, throwError } from '../utils/service.utils';

export const getListadoRecorridos = async (token: string | null) => {
  try {
    const resp = await authGet<Recorrido[]>(`${baseUrl}/Recorrido`, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};

export const postRecorrido = async (token: string | null, data: RecorridoFormType) => {
  try {
    data.horario = mapTimeToDateTimeString(data.horario);
    const resp = await authPost<Recorrido>(`${baseUrl}/Recorrido`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};

export const putRecorrido = async (token: string | null, data: RecorridoFormType) => {
  try {
    data.horario = mapTimeToDateTimeString(data.horario);
    const resp = await authPut<Recorrido>(`${baseUrl}/Recorrido`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};

export const deleteRecorrido = async (token: string | null, id: number) => {
  try {
    const resp = await authDelete<Recorrido>(`${baseUrl}/Recorrido`, id, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};
