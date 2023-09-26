import '../../css/style.css';
import { ContentBase } from '../../components/ContentBase';
import { Button, Card, Form, Modal, Stack } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import OfficerService from '../../services/OfficerService';
import UserService from '../../services/UserService';
import TeamsService from '../../services/TeamsService';
import AuthService from '../../services/AuthService';
import BottomAlert from '../../components/BottomAlert';
import { useNavigate } from 'react-router-dom';

export function Profile() {
    const { handleSubmit, register, formState: { errors } } = useForm();

    const [user, setUser] = useState([]);
    const [officer, setOfficer] = useState([]);
    const [team, setTeam] = useState([]);

    const [alert, setAlert] = useState();

    const navigate = useNavigate();


    const handleAlertClose = () => {
        const updatedAlert = { ...alert, show: false };
        setAlert(updatedAlert);
    };

    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const officerService = new OfficerService();
    const userService = new UserService();
    const teamService = new TeamsService();

    async function loadData() {

        const user_id = sessionStorage.getItem('id');

        await userService.getUser({ id: user_id })
            .then(async (result) => {

                var userResult = result.data;
                userResult.password = '';
                setUser(userResult)

                if (userResult.officer_id > 0) {
                    const officerResult = await officerService.getById({ id: result.data.officer_id });
                    setOfficer(officerResult.data);

                    if (userResult.team_id) {
                        const teamResult = await teamService.getById({ id: officerResult.data.team_id });
                        setTeam(teamResult.data)
                    }
                }
            });
    }

    const onSubmit = async (data) => {
        try {

            console.log(officer)
            console.log(user)

            await officerService.updateOfficer(officer);
            await userService.update(user);

            setDisabled(true)
            loadData();
            setAlert({ show: true, variant: 'success', message: 'Alterações realizadas com sucesso' });

        } catch (error) {
            console.log(error)
        }
    }

    async function onDelete() {
        try {

            console.log(officer)
            console.log(user)

            var updateOfficer = officer;
            updateOfficer.status = "INACTIVE"
            setOfficer(updateOfficer)

            await officerService.updateOfficer(officer);
            await userService.delete(user);

            AuthService.logout();
            navigate('/login')

        } catch (error) {
            console.log(error)
        }
    }

    const editClick = () => {
        setDisabled(false)
    }


    const deleteButtonClick = () => {
        setShowDeleteModal(true)
    }

    const goBackClick = () => {
        setDisabled(true)
        loadData();
    }


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [operationToDelete, setOperationToDelete] = useState([]);

    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <h1>Perfil</h1>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group>
                                    <Form.Label>Nome do Policial</Form.Label>
                                    <Form.Control
                                        disabled={disabled}
                                        type='text'
                                        className="mb-3"
                                        required={true}
                                        {...register('name')}
                                        value={officer.name}
                                        onChange={(e) => { setOfficer({ ...officer, name: e.target.value }) }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control
                                        disabled={disabled}
                                        type='text'
                                        className="mb-3"
                                        required={true}
                                        {...register('email')}
                                        value={user.email}
                                        onChange={(e) => { setUser({ ...user, email: e.target.value }) }}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control
                                        disabled={disabled}
                                        type='password'
                                        className="mb-3"
                                        required={true}
                                        {...register('password')}
                                        value={(disabled) ? "*******" : user.password}
                                        onChange={(e) => { setUser({ ...user, password: e.target.value }) }}
                                    />
                                </Form.Group>
                                <Form.Group className='pb-3'>
                                    <Form.Label>Equipe</Form.Label>
                                    <Form.Control
                                        {...register('team_id')}
                                        onChange={(e) => { setOfficer({ ...officer, team_id: e.target.value }) }}
                                        value={team.team_name}
                                        key={team.id}
                                        disabled
                                    />
                                </Form.Group>


                                <div className='pt-5 d-flex flex-column'>
                                    <Stack gap={3}>
                                        <Button variant="primary" onClick={editClick} hidden={!(disabled)}>
                                            Editar informações
                                        </Button>
                                        <Button variant="danger" onClick={deleteButtonClick} hidden={!(disabled)}>
                                            Excluir conta
                                        </Button>
                                        <Button variant="success" type='submit' hidden={(disabled)}>
                                            Salvar informações
                                        </Button>
                                        <Button variant="secondary" onClick={goBackClick} hidden={(disabled)}>
                                            Cancelar
                                        </Button>
                                    </Stack>
                                </div>

                            </Form>

                        </Card.Body>
                    </Card>
                </Stack>
            </div>

            <Modal show={showDeleteModal} >
                <Modal.Header>
                    <Modal.Title>Excluir conta ?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>
                        <p>Deseja mesmo excluir sua conta?</p>
                        <p className='text-danger'>Esta ação é definitiva e não poderá ser desfeita.</p>
                    </b>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => onDelete()}>
                        Sim, excluir conta
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>

            </Modal>

            {alert &&
                <BottomAlert
                    show={alert.show}
                    variant={alert.variant}
                    message={alert.message}
                    onClose={handleAlertClose}
                />
            }

        </>
    );
}

