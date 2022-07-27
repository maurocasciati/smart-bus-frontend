import React, { useState } from 'react';
import { DataInicialRegistroType } from '../form/FormTypes';
import RegistrarUsuario from './RegistrarUsuario';
import VerificarEmail from './VerificarEmail';

export default function SignUp(props: { toggleLogin: () => void}) {
  const [verificado, setVerificado] = useState<boolean>(false);
  const [dataInicialRegistro, setDataInicialRegistro] = useState<DataInicialRegistroType>();

  const handleToggleLogin = () => props.toggleLogin();

  const handleToggleVerificado = (dataInicial: DataInicialRegistroType) => {
    setDataInicialRegistro(dataInicial);
    setVerificado(!verificado);
  };

  return verificado
    ? <RegistrarUsuario toggleLogin={handleToggleLogin} dataInicial={dataInicialRegistro}/>
    : <VerificarEmail toggleLogin={handleToggleLogin} toggleVerificado={handleToggleVerificado}/>;
}
