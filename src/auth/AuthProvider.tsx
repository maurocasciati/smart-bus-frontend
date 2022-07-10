import React, { createContext, useState } from 'react';
import { RolUsuario } from '../domain/RolUsuario';

export type AuthContextType = {
  token: string | null;
  saveToken: (token: string) => void;
  rol: RolUsuario | null;
  saveRol: (idTipoDeUsuario: number) => void;
  id: number | null;
  saveId: (id: number) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [rol, setRol] = useState<RolUsuario | null>(null);
  const [id, setId] = useState<number | null>(null);

  const saveToken = (token: string) => setToken(token);
  const saveRol = (idTipoDeUsuario: number) => setRol(idTipoDeUsuario as RolUsuario);
  const saveId = (id: number) => setId(id);

  return (
    <AuthContext.Provider value={{token, saveToken, rol, saveRol, id, saveId}}>
      {children}
    </AuthContext.Provider>
  );
};