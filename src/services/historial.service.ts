import { REACT_APP_BASE_URL as baseUrl } from '@env';
import { HistorialRecorrido } from '../domain/HistorialRecorrido';
import { authGet, throwError } from '../utils/service.utils';

export const getHistorialRecorridos = async (token: string | null) => {
  try {
    const resp = await authGet<HistorialRecorrido[]>(`${baseUrl}/HistorialRecorrido`, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};
