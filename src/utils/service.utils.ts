import axios, { AxiosError, AxiosResponse } from 'axios';

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
