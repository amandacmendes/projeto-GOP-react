import '../css/style.css';
import '../css/sidebar.css';

import React from 'react';
import { slide as Menu } from 'react-burger-menu';

import Image from 'react-bootstrap/Image';
import mainlogo from '../img/Logo_GOP_1-removebg-preview.png';

import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

export function LeftMenu() {

    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout(); // Faz a chamada ao serviço de logout
        navigate('/'); // Redireciona o usuário para a página de login após o logout
    };

    return (
        <Menu>
            <Image src={mainlogo} alt='logo' className='img-fluid'></Image>
            <a className="menu-item" href="/mainpage">
                Página Inicial
            </a>
            <a className="menu-item" href="/dashboard">
                Dashboard
            </a>
            <a className="menu-item" href="/operation">
                Operações Policiais
            </a>
            <br />

            <a className="menu-item" href="/team">
                Equipes Policiais
            </a>
            <a className="menu-item" href="/resources">
                Viaturas e outros Recursos 
            </a>
            <a className="menu-item" href="/profile">
                Perfil
            </a>
            <a className="menu-item" onClick={handleLogout}>
                Sair do sistema
            </a>
        </Menu>
    );
};
