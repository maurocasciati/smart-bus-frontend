import { REACT_APP_BASE_URL as baseUrl } from '@env';
import { EventualidadFormType } from '../components/form/FormTypes';
import { authPost, throwError } from '../utils/service.utils';

export const postEventualidad = async (token: string | null, data: EventualidadFormType) => {
  try {
    const resp = await authPost(`${baseUrl}/Eventualidad`, data, token);
    return resp.data;
  } catch(error) {
    throwError(error);
  }
};
