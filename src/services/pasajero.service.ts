import { REACT_APP_BASE_URL as baseUrl } from '@env';
import { PasajeroFormType } from '../components/form/FormTypes';
import { Pasajero } from '../domain/Pasajero';
import { authGet, authPost, authPut, throwError } from '../utils/service.utils';

export const getListadoPasajeros = async (token: string | null) => {
  try {
    const resp = await authGet<Pasajero[]>(`${baseUrl}/Pasajero`, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};

export const postPasajero = async (token: string | null, data: PasajeroFormType) => {
  try {
    const resp = await authPost<Pasajero>(`${baseUrl}/Pasajero`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};

export const putPasajero = async (token: string | null, data: PasajeroFormType) => {
  try {
    const resp = await authPut<Pasajero>(`${baseUrl}/Pasajero`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};
