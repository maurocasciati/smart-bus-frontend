import axios, { AxiosError, AxiosResponse } from 'axios';

const textoErrorAutenticacion = 'Error de autenticación. Inicie sesión.';

const getHeaders = (token: string) => {
  return { headers: { Authorization: `Bearer ${token}` }};
};

export async function authPost<T>(url: string, data: unknown, token: string | null) {
  if (token) {
    return axios.post<T>(url, data, getHeaders(token));
  } else {
    throw textoErrorAutenticacion;
  }
}

export async function authPut<T>(url: string, data: unknown, token: string | null) {
  if (token) {
    return axios.put<T>(url, data, getHeaders(token));
  } else {
    throw textoErrorAutenticacion;
  }
}

export async function authGet<T>(url: string, token: string | null) {
  if (token) {
    return axios.get<T>(url, getHeaders(token));
  } else {
    throw textoErrorAutenticacion;
  }
}

export async function authDelete<T>(url: string, id: number, token: string | null) {
  if (token) {
    return axios.delete<T>(url + '/' + id, getHeaders(token));
  } else {
    throw textoErrorAutenticacion;
  }
}

export const throwError = (error: unknown) => {
  if(axios.isAxiosError(error)){
    const err = error as AxiosError;
    const errorResponse = err.response as AxiosResponse<{message?: string, title: string}>;
    if(errorResponse.data)
      throw errorResponse.data.message ?? errorResponse.data.title;
    else
      throw err.message;
  }
  else{
    throw error;
  }
};
