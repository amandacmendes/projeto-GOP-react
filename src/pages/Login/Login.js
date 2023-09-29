import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
import '../../css/style.css';

import mainlogo from '../../img/Logo_GOP_1-removebg-preview.png';

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import AuthService from '../../services/AuthService';

import { Alert } from 'react-bootstrap';

export function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [alert, setAlert] = useState({ show: false, variant: 'primary', message: '' });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        checkAlerts();
    }, []);

    function checkAlerts() {
        console.log(location.state?.alertMessage)

        if (location.state?.alertMessage) {
            console.log(location.state?.alertMessage)
            setAlert({
                show: true,
                variant: location.state?.alertVariant,
                message: location.state?.alertMessage
            })
        }
    }

    const handleLogin = async (e) => {

        e.preventDefault();
        try {
            await AuthService.login(email, password);
            navigate('/mainpage');
        } catch (error) {
            console.log(error)
            setError(error.message);
        }
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    const handleAlertClose = () => {
        const updatedAlert = { ...alert, show: false, message: '' };
        setAlert(updatedAlert);
    };

    return (
        <>
            <Row className='mh-100'>
                <Col className='d-flex d-none d-md-block grey-bg align-items-center justify-content-center'>
                    <div className='d-flex h-100 align-items-center justify-content-center'>
                        <Image src={mainlogo} alt='logo'></Image>
                    </div>
                </Col>
                <Col className='align-self-center p-3'>
                    <Stack gap={4}>
                        <h1 className='text-center'>Login</h1>

                        <form onSubmit={handleLogin}>
                            <div className="form-group mb-3">
                                <label for="email">E-mail:</label>
                                <input type="text" className="form-control" id="email" name="email"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group mb-4">
                                <label for="password">Senha:</label>
                                <input type="password" className="form-control" id="password" name="password"
                                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            {error &&
                                <Alert variant='danger' transition='true' dismissible>
                                    {error}
                                </Alert>
                            }

                            {alert.show &&
                                <Alert
                                    variant={alert.variant}
                                    transition='true'
                                    onClose={handleAlertClose}
                                    dismissible
                                >
                                    {alert.message}
                                </Alert>
                            }
                            <div className="d-grid text-center">
                                <button type="submit" className="btn btn-success">
                                    Entrar
                                </button>
                            </div>
                        </form>

                        <div className="d-grid text-center">
                            <p>ou</p>
                            <button type="button" className="btn btn-secondary"
                                onClick={handleSignupClick}>Cadastre-se
                            </button>
                        </div>
                    </Stack>
                </Col>
            </Row>
        </>
    );
}

