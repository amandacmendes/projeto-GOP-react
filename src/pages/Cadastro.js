import '../css/style.css';
import mainlogo from '../img/Logo_GOP_1-removebg-preview.png';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';

import { useNavigate } from "react-router-dom";
import { useState } from 'react';

import UserService from '../services/UserService';
import { Alert } from 'react-bootstrap';

export function Cadastro() {

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/'); // Redireciona o usuário para a página de login após o logout
    };

    return (
        <>
            <Row className='mh-100'>
                <Col className='col-3 d-flex d-none d-md-block grey-bg align-items-center justify-content-center'>
                    <div className='d-flex align-items-center justify-content-center'>
                        <Image src={mainlogo} alt='logo'></Image>
                    </div>
                </Col>
                <Col className='align-self-center px-4'>
                    <Stack gap={3}>
                        <h1 className='text-center'>Cadastro</h1>
                        <FormLogin />
                        <Button className='m-3' variant='secondary' onClick={handleGoBack}>Voltar à página de Login</Button>
                    </Stack>
                </Col>
            </Row>
        </>
    );
}

function FormLogin() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await UserService.create(email, password, name);

            setAlert('success')
            setAlertMessage('Cadastro realizado com sucesso. Redirecionando para a página de login...');
            setTimeout(3000);

            navigate('/');
        } catch (error) {
            setAlert('danger')
            setAlertMessage(error.message);
        }
    };

    return (
        <>
            {alert &&
                <Alert variant={alert} transition='true' dismissible>
                    {alertMessage}
                </Alert>
            }

            <Form className='p-3' onSubmit={handleSignUp}>

                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Informe seu Nome</Form.Label>
                    <Form.Control type="name" placeholder="Nome Completo"
                        value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Informe seu E-mail</Form.Label>
                    <Form.Control type="email" placeholder="E-mail"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Informe sua Senha</Form.Label>
                    <Form.Control type="password" placeholder="Senha"
                        value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>

                <br />
                <div className='text-center'>
                    <Stack gap={2}>
                        <Button variant="success" type="submit" >
                            Cadastrar
                        </Button>
                    </Stack>
                </div>
            </Form>
        </>
    );
}
