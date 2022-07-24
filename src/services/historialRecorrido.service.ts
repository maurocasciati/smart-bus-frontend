import { REACT_APP_BASE_URL as baseUrl } from '@env';
import { HistorialRecorridoType } from '../components/form/FormTypes';
import { authPost, throwError } from '../utils/service.utils';

export const postHistorialRecorrido = async (token: string | null, data: HistorialRecorridoType) => {
  // TODO: Borrar cuando el back guarde interrumpidos
  if (data.interrumpido) {
    return data;
  }

  try {
    const resp = await authPost(`${baseUrl}/HistorialRecorrido`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};
