import '../../css/style.css';
import { Button, Form, InputGroup, Modal, Stack, Table } from "react-bootstrap";
import { ContentBase } from '../../components/ContentBase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TeamsService from '../../services/TeamsService';
import OfficerService from '../../services/OfficerService';
import { useForm } from 'react-hook-form';

export function Officers() {

    function handleNewOfficer() {

    }


    const navigate = useNavigate();

    const [data, setData] = useState([]);

    const [showModalOfficer, setShowModalOfficer] = useState(false);

    const [officer, setOfficer] = useState([])
    const [modalAction, setModalAction] = useState('');

    const officerService = new OfficerService();

    async function getOfficers() {
        try {
            await officerService.getOfficersWithTeams()
                .then((result) => {
                    const mappedResult = {};
                    result.forEach((item) => {
                        mappedResult[item.id] = item;
                    });
                    setData(mappedResult)
                });
        } catch (error) {
            console.log(error)
            navigate('/*');
        }
    }

    useEffect(() => {
        getOfficers();
    }, []);

    async function handleEdit(data) {
        try {
            setOfficer(data)
            setShowModalOfficer(true)
            setModalAction('edit')
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(data) {
        try {

            // NEEDSALERT NEEDS ALERT delete

            console.log(data)

            if (data.id > 0) {

                await officerService.deleteOfficerOperationByOfficerId(data)
                    .then((result) => {
                        console.log(result)
                        getOfficers();
                    });;

                await officerService.deleteOfficer(data.id)
                    .then((result) => {
                        console.log(result)
                        getOfficers();
                    });
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <ContentBase />
            <div className='container'>
                <Stack gap={5}>
                    <div className='d-flex flex-row w-auto justify-content-between'>
                        <h1>Policiais</h1>
                        <div>
                            <Button onClick={handleNewOfficer}>Registrar Novo Policial</Button>
                        </div>
                    </div>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nome </th>
                                <th>Equipe</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(data).length > 0 ? (
                                Object.keys(data).map((id) => (
                                    <TableContent
                                        key={id}
                                        id={data[id].id}
                                        team_name={data[id].team ? data[id].team.team_name : ''}
                                        name={data[id].name}
                                        editOperation={async () => handleEdit(data[id])}
                                        deleteOperation={async () => handleDelete(data[id])}
                                    />


                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Não existe nenhum policial cadastrado!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {(showModalOfficer) ?
                        <ModalOfficer
                            officer={officer}
                            action={modalAction}
                            showModal={showModalOfficer}
                            setShowModal={setShowModalOfficer}
                        />
                        : ''
                    }
                </Stack>
            </div>
        </>
    );
}

function TableContent(props) {
    return (
        <tr key={props.id}>
            <td>{props.id}</td>
            <td>{props.name}</td>
            <td>{props.team_name}</td>
            <td colSpan={1}>
                <div>

                    <Button variant="outline-primary" size='sm'
                        onClick={props.editOperation}>
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                    </Button>{' '}
                    <Button variant="outline-danger" size='sm'
                        onClick={props.deleteOperation}>
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                    </Button>{' '}
                </div>
            </td>
        </tr>
    )
}

function ModalOfficer(props) {

    const [officer, setOfficer] = useState({ id: null, name: '', team_id: null })
    const [team, setTeam] = useState([]);

    const { showModal, setShowModal, action } = props;

    const { handleSubmit, register, formState: { errors } } = useForm();

    useEffect(() => {
        loadData();
    }, []);

    const teamService = new TeamsService();
    const officerService = new OfficerService();

    function loadData() {

        const team = teamService.getAllTeams()
            .then((result) => {
                setTeam(result.data)
            })

        if (props.officer.id > 0) {
            console.log('LOAD DATA')
            console.log(props.officer)
            setOfficer({ id: props.officer.id, name: props.officer.name, team_id: props.officer.team_id })
        }
    }

    const onSubmit = async (data) => {
        try {

            setOfficer({ ...officer, name: data.name, team_id: data.team_id })

            if (props.action == 'edit') {

                await officerService.updateOfficer(officer)
                    .then((result) => { console.log(result) })
                    setShowModal(false);

            } else if (props.action == 'new') {

                await officerService.createOfficer(officer)
                    .then((result) => { console.log(result) })
            }

        } catch (error) {

        }
    }

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)} >
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>
                        <Modal.Title>{(action === 'edit') ? 'Editar Policial' : 'Cadastrar Policial'}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Nome do Policial</Form.Label>
                            <Form.Control
                                type='text'
                                className="mb-3"
                                required={true}
                                {...register('name')}
                                value={officer.name}
                                onChange={(e) => { setOfficer({ ...officer, name: e.target.value }) }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Equipe</Form.Label>
                            <Form.Select
                                {...register('team_id')}
                                onChange={(e) => { setOfficer({ ...officer, team_id: e.target.value }) }}
                            >
                                <option>Selecione uma equipe</option>
                                {team.map((teamItem) => (
                                    <option
                                        selected={(teamItem.id == officer.team_id ? true : false)}
                                        key={teamItem.id}
                                        value={teamItem.id}
                                    >
                                        {teamItem.team_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" type="submit">
                            Salvar
                        </Button>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Fechar
                        </Button>
                    </Modal.Footer>

                </Form>
            </Modal>
        </>
    )
}