import { REACT_APP_BASE_URL as baseUrl } from '@env';
import { EstadoDeCuenta } from '../domain/EstadoDeCuenta';
import { authGet, authPut, throwError } from '../utils/service.utils';

export const getEstadoDeCuenta = async (token: string | null, idRecorrido: number, idPasajero: number) => {
  try {
    const resp = await authGet<EstadoDeCuenta>(`${baseUrl}/EstadoDeCuenta/${idRecorrido}/${idPasajero}`, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};

export const putEstadoDeCuenta = async (token: string | null, data: EstadoDeCuenta) => {
  try {
    const resp = await authPut<EstadoDeCuenta>(`${baseUrl}/EstadoDeCuenta`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};
