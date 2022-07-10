export enum RolUsuario {
  CHOFER = 1,
  TUTOR = 2,
  ESCUELA = 3,
}

export const getTipoUsuario = {
  [RolUsuario.CHOFER]: 'Chofer',
  [RolUsuario.TUTOR]: 'Tutor',
  [RolUsuario.ESCUELA]: 'Escuela',
};
