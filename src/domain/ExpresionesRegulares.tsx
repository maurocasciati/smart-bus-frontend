export const EX_REG = {
  EMAIL:  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
  HORARIO: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/i,
  TELEFONO: /^[0-9\-+]{9,15}$/i,
  FECHA: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/i,
};