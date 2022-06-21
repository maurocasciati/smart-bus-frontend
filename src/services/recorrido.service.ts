import { REACT_APP_BASE_URL as baseUrl } from '@env';
import { RecorridoFormType } from '../components/form/FormTypes';
import { Recorrido } from '../domain/Recorrido';
import { authGet, authPost, authPut, throwError } from '../utils/service.utils';

export const getListadoRecorridos = async (token: string | null) => {
  try {
    const resp = await authGet<Recorrido[]>(`${baseUrl}/Recorrido`, token);
    return resp.data.map(recorrido => ({ ...recorrido, horario: recorrido.horario.slice(11, -7)}));
  } catch(error) {
    throwError(error);
  }
};

export const postRecorrido = async (token: string | null, data: RecorridoFormType) => {
  try {
    data.horario = `2022-06-21T${data.horario}:58.473`;
    const resp = await authPost<Recorrido>(`${baseUrl}/Recorrido`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};

export const putRecorrido = async (token: string | null, data: RecorridoFormType) => {
  try {
    data.horario = `2022-06-21T${data.horario}:58.473`;
    const resp = await authPut<Recorrido>(`${baseUrl}/Recorrido`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};
