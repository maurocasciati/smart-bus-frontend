import React, { createContext, useState } from 'react';

export type AuthContextType = {
  token: string | null;
  saveToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  const saveToken = (token: string) => setToken(token);

  return (
    <AuthContext.Provider value={{token, saveToken}}>
      {children}
    </AuthContext.Provider>
  );
};